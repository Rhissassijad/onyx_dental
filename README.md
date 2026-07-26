# Onyx Dental Office

A modern dental office web application with appointment booking and team management.

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
- **Deployment**: Vercel (Frontend), Render (Backend)

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/onyxdental
PORT=5000
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
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Security

- Never commit `.env` files to Git
- Use `.env.example` as a template
- Always use strong passwords for MongoDB
- Restrict MongoDB network access in production
- Use environment-specific secrets on deployment platforms

## Features

- 📅 Online appointment booking
- 👥 Team member profiles
- 📍 Location information
- 📱 Fully responsive design

## API Endpoints

- `GET /api/team` - Get all team members
- `GET /api/appointments` - Get all appointments (admin)
- `POST /api/check-availability` - Check appointment availability

## License

ISC
