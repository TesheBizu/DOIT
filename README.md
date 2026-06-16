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

### Configure SMTP (server)

In `server/.env`, set:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true` for port 465, otherwise `false`)
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM` (optional; defaults to `SMTP_USER`)
- `CLIENT_URL` (used to generate the reset link)

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
| `JWT_SECRET`  | Secret for signing JWT tokens  |
| `CLIENT_URL`  | Frontend URL for CORS          |
| `SMTP_HOST`   | SMTP host for reset emails     |
| `SMTP_PORT`   | SMTP port (e.g. 587 or 465)    |
| `SMTP_SECURE` | `true` if using port 465       |
| `SMTP_USER`   | SMTP username / email          |
| `SMTP_PASS`   | SMTP password / API key        |
| `EMAIL_FROM`  | Optional “from” address        |

### Client (`client/.env`)

| Variable       | Description              |
|----------------|--------------------------|
| `VITE_API_URL` | Backend API base URL     |

## Development Workflow

This project uses a feature-branch workflow. Each phase is developed on its own branch and merged into `main`.

## Deployment Notes

### Backend (Render / Railway / Fly.io)

- Set environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
- Start command: `npm start` in `server/`
- Ensure frontend URL is listed in `CLIENT_URL` for CORS

### Frontend (Vercel / Netlify)

- Set `VITE_API_URL` to your deployed backend API URL (for example `https://api.example.com/api`)
- Build command: `npm run build`
- Output directory: `dist`

## License

ISC
