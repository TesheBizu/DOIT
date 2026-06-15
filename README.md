# DOIT

A modern productivity and task management platform built with the MERN stack.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React (Vite), Tailwind CSS, Lucide React, Axios, React Router |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB, Mongoose                   |
| Auth     | JWT, bcryptjs (Phase 2+)          |

## Project Structure

```
DOIT/
├── client/          # React frontend (Vite)
└── server/          # Express API
```

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TesheBizu/DOIT.git
cd DOIT
```

### 2. Server setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Client setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs at `http://localhost:5173`

## API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "DOIT API is running",
  "timestamp": "..."
}
```

## Auth API (Phase 2)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |

**Note:** MongoDB must be running for auth endpoints to work.

## Environment Variables

### Server (`server/.env`)

| Variable      | Description                    |
|---------------|--------------------------------|
| `PORT`        | API port (default: 5000)       |
| `MONGODB_URI` | MongoDB connection string      |
| `JWT_SECRET`  | Secret for signing JWT tokens  |
| `CLIENT_URL`  | Frontend URL for CORS          |

### Client (`client/.env`)

| Variable       | Description              |
|----------------|--------------------------|
| `VITE_API_URL` | Backend API base URL     |

## Development Workflow

This project uses a feature-branch workflow. Each phase is developed on its own branch and merged into `main`.

## License

ISC
