require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5001;
const employeeSessions = new Map();

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onyxdental';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schemas and Models

const TeamMemberSchema = new mongoose.Schema({
    name: String,
    photo: String,
    role: String,
});

const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);

const AppointmentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    datetime: Date,
    status: { type: String, default: 'pending' },
    confirmedAt: Date,
    paid: { type: Boolean, default: false },
    paymentProvider: { type: String, default: 'none' },
    paymentReference: String,
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })
  : null;

async function sendReminderEmail({ to, firstName, datetime }) {
    if (!to || !transporter) {
        console.log('[Reminder] Email skipped. Missing recipient or SMTP configuration.', { to, firstName, datetime });
        return { sent: false, reason: 'smtp-not-configured' };
    }

    const formattedDate = new Date(datetime).toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@onyxdental.local',
            to,
            subject: 'Rappel de rendez-vous - Onyx Dental',
            html: `<p>Bonjour ${firstName || 'client'},</p><p>Ce rappel confirme votre rendez-vous le ${formattedDate}.</p><p>Merci de nous contacter si vous avez besoin de modifier votre créneau.</p>`,
        });
        return { sent: true };
    } catch (error) {
        console.error('[Reminder] Email failed', error);
        return { sent: false, reason: error.message };
    }
}

function requireEmployee(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!employeeSessions.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Routes

// Get team members
app.get('/api/team', async (req, res) => {
    const team = await TeamMember.find();
    res.json(team);
});

// Add team members (for setup or admin)
// Remove or protect in production
app.post('/api/team', async (req, res) => {
    try {
        const member = new TeamMember(req.body);
        await member.save();
        res.json({message: 'Team member added'});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all appointments (for admin or debug)
app.get('/api/appointments', async (req, res) => {
    const appts = await Appointment.find();
    res.json(appts);
});

// Check if datetime is available
app.post('/api/check-availability', async (req, res) => {
    try {
        const { datetime } = req.body;
        const dateObj = new Date(datetime);
        // Check if appointment exists at the date/time
        const existing = await Appointment.findOne({datetime: dateObj});
        res.json({ available: !existing });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, datetime } = req.body;

        const dateObj = new Date(datetime);
        const existing = await Appointment.findOne({ datetime: dateObj });
        if (existing) {
            return res.status(400).json({ error: 'This appointment slot is already booked.' });
        }

        const appointment = new Appointment({
            firstName,
            lastName,
            phone,
            email,
            datetime: dateObj,
            status: 'pending',
            paid: false,
            paymentProvider: 'none',
            paymentReference: `appointment-${Date.now()}`,
        });
        await appointment.save();

        res.json({ appointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/appointments/:id/confirm', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = 'confirmed';
        appointment.confirmedAt = new Date();
        await appointment.save();

        const reminderResult = await sendReminderEmail({
            to: appointment.email,
            firstName: appointment.firstName,
            datetime: appointment.datetime,
        });

        res.json({ appointment, reminderSent: reminderResult.sent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to confirm appointment' });
    }
});

app.post('/api/create-checkout-session', async (req, res) => {
    const { firstName, lastName, phone, email, datetime } = req.body;
    const dateObj = new Date(datetime);
    const appointment = new Appointment({
        firstName,
        lastName,
        phone,
        email,
        datetime: dateObj,
        status: 'pending',
        paid: false,
        paymentProvider: 'none',
        paymentReference: `appointment-${Date.now()}`,
    });
    await appointment.save();
    res.json({ appointment });
});

app.post('/api/employees/login', (req, res) => {
    const username = req.body.username || '';
    const password = req.body.password || '';
    const expectedUsername = process.env.EMPLOYEE_USERNAME || 'employee';
    const expectedPassword = process.env.EMPLOYEE_PASSWORD || 'onyx2026';

    if (username !== expectedUsername || password !== expectedPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = crypto.randomBytes(16).toString('hex');
    employeeSessions.set(token, { username });

    res.json({ token, employeeName: 'Employee' });
});

app.get('/api/employees/appointments', requireEmployee, async (req, res) => {
    const appointments = await Appointment.find().sort({ datetime: 1 });
    res.json(appointments);
});

app.post('/api/employees/appointments', requireEmployee, async (req, res) => {
    try {
        const { firstName, lastName, phone, email, datetime } = req.body;
        const dateObj = new Date(datetime);
        const existing = await Appointment.findOne({ datetime: dateObj });
        if (existing) {
            return res.status(400).json({ error: 'This appointment slot is already booked.' });
        }

        const appointment = new Appointment({
            firstName,
            lastName,
            phone,
            email,
            datetime: dateObj,
            status: 'confirmed',
            confirmedAt: new Date(),
            paid: true,
            paymentProvider: 'employee-booked',
            paymentReference: `employee-${Date.now()}`,
        });
        await appointment.save();

        await sendReminderEmail({ to: email, firstName, datetime: dateObj });
        res.json({ appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create appointment' });
    }
});

app.post('/api/employees/appointments/:id/cancel', requireEmployee, async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json({ success: true, deletedId: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to cancel appointment' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

