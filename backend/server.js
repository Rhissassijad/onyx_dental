require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/onyxdental', {
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
    paid: Boolean,
    stripeSessionId: String,
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

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

// Create a Stripe Payment Session and appointment placeholder
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, datetime } = req.body;

        const dateObj = new Date(datetime);
        // Check availability first
        const existing = await Appointment.findOne({datetime: dateObj});
        if (existing) {
            return res.status(400).json({ error: 'This appointment slot is already booked.' });
        }

        // Price amount in cents (e.g. 50 euros = 5000)
        const paymentAmount = 5000; // Fixed price for appointment: 50 euros

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Prise de rendez-vous Onyx Dental',
                    },
                    unit_amount: paymentAmount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel.html',
            metadata: {
                firstName,
                lastName,
                phone,
                email,
                datetime: dateObj.toISOString(),
            },
        });

        // Create appointment entry with paid=false, will update after webhook confirmation
        const appointment = new Appointment({
            firstName,
            lastName,
            phone,
            email,
            datetime: dateObj,
            paid: false,
            stripeSessionId: session.id,
        });
        await appointment.save();

        res.json({ id: session.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Stripe webhook to confirm payment and mark appointment as paid
// Configure your Stripe webhook secret in environment variable STRIPE_WEBHOOK_SECRET for production
const endpointSecret = ''; // OPTIONAL, leave empty if not set

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            event = req.body;
        }
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Find the appointment by stripeSessionId and mark as paid
        const appt = await Appointment.findOne({stripeSessionId: session.id});
        if (appt) {
            appt.paid = true;
            await appt.save();
        }
    }

    res.json({received: true});
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

