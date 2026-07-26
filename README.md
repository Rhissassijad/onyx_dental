# Onyx Dental Office

A modern dental office web application with appointment booking, team management, and payment processing.

## Project Structure

```
onyx-dental-office/
├── frontend/     → Next.js React application
├── backend/      → Node.js/Express API
└── README.md     → This file
```

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **Payments**: Stripe
- **Deployment**: Vercel (Frontend), Render (Backend)

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Stripe account

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/onyxdental
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_key
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
```

Start frontend:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to Vercel, Render, and MongoDB Atlas.

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Stripe public key

## Security

- Never commit `.env` files to Git
- Use `.env.example` as a template
- Always use strong passwords for MongoDB
- Restrict MongoDB network access in production
- Use environment-specific secrets on deployment platforms

## Features

- 📅 Online appointment booking
- 💳 Secure payment processing with Stripe
- 👥 Team member profiles
- 📍 Location information
- 📱 Fully responsive design

## API Endpoints

- `GET /api/team` - Get all team members
- `GET /api/appointments` - Get all appointments (admin)
- `POST /api/check-availability` - Check appointment availability
- `POST /api/create-checkout-session` - Create Stripe payment session

## License

ISC
