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

## Forgot Password (Email Reset)

DOIT supports password reset via email.

### Configure SendGrid (server)

Password reset emails use [SendGrid](https://sendgrid.com) (HTTP API — works on Render free tier).

1. Create a free SendGrid account (100 emails/day).
2. **Settings → API Keys** → create a key with **Mail Send** permission.
3. **Settings → Sender Authentication** → verify a single sender email.
4. In `server/.env`, set:

- `SENDGRID_API_KEY` — your SendGrid API key
- `EMAIL_FROM` — verified sender, e.g. `DOIT <you@example.com>`
- `CLIENT_URL` — used to generate the reset link

### Flow

- Go to `/forgot-password` and submit your email.
- You will receive an email with a link to `/reset-password?token=...`.
- Set a new password and sign in again.

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

## Projects API (Phase 3)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/projects` | Yes | List user's projects |
| POST | `/api/projects` | Yes | Create a project |
| GET | `/api/projects/:id` | Yes | Get a single project |
| PUT | `/api/projects/:id` | Yes | Update a project |
| DELETE | `/api/projects/:id` | Yes | Delete a project |

## Tasks API (Phase 4)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/projects/:projectId/tasks` | Yes | List tasks for a project |
| POST | `/api/projects/:projectId/tasks` | Yes | Create task in a project |
| PUT | `/api/tasks/:id` | Yes | Update task details |
| PATCH | `/api/tasks/:id/status` | Yes | Quick status update |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

## Dashboard API (Phase 5)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/dashboard` | Yes | Aggregated productivity stats + recent tasks |
| GET | `/api/tasks/search?q=` | Yes | Search tasks across all user projects |

## Production Hardening (Phase 6)

- `helmet` enabled for common HTTP security headers
- Auth route rate limiting (`30 requests / 15 minutes / IP`)
- Client-side `ErrorBoundary` for runtime UI errors
- `404` route fallback page (`*`)
- Skeleton loading states for Dashboard and ProjectDetail

## Environment Variables

### Server (`server/.env`)

| Variable      | Description                    |
|---------------|--------------------------------|
| `PORT`        | API port (default: 5000)       |
| `MONGODB_URI` | MongoDB connection string      |
| `JWT_SECRET`       | Secret for signing JWT tokens         |
| `CLIENT_URL`       | Frontend URL for CORS and reset links |
| `SENDGRID_API_KEY` | SendGrid API key for password reset   |
| `EMAIL_FROM`       | Verified SendGrid sender address      |

### Client (`client/.env`)

| Variable       | Description              |
|----------------|--------------------------|
| `VITE_API_URL` | Backend API base URL     |
