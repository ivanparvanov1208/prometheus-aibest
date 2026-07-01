# Attendly Frontend

React/Vite frontend for Attendly.

## Project Location

Frontend root directory:

```text
front-end
```

## Local Setup

```bash
npm install
npm run dev
```

Local dev server:

```text
http://localhost:3000
```

## Environment

Create a local `.env` file from `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Only the public backend base URL belongs in `VITE_API_URL`. Do not put secrets in Vite environment variables because they are exposed to the browser bundle.

## Build

```bash
npm run build
```

Production output directory:

```text
dist
```

## Vercel Deployment

Use these Vercel settings:

```text
Root directory: front-end
Build command: npm run build
Output directory: dist
Environment variable: VITE_API_URL
```

`vercel.json` rewrites all routes to `index.html` so direct visits to SPA routes such as `/events/1` work.

## Implemented Frontend Flows

Student-facing UI:

- Register a student account through `POST /api/register`.
- Log in through `POST /api/login`.
- Persist DRF token authentication after refresh.
- Browse events through `GET /api/events`.
- Open event details through `GET /api/events/:id`.
- Register for an event through `POST /api/events/:id/registrations`.
- Show `CONFIRMED` or `WAITLISTED` status from the backend response.
- Show waitlist position when returned.
- View own registrations through `GET /api/registrations/me`.
- Cancel own registrations through `DELETE /api/registrations/:id`.

Organizer-facing UI:

- View organizer events through `GET /api/events`.
- Create draft events through `POST /api/events`.
- Edit events through `PUT /api/events/:id`.
- Preview saved event details with the same presentation used by student details.
- Publish through `POST /api/events/:id/publish`.
- Cancel through `POST /api/events/:id/cancel`.
- View confirmed registrations through `GET /api/events/:id/registrations`.
- View waitlist through `GET /api/events/:id/waitlist`.

## Backend Contract

| Method | Path | Auth | Role | Exists now | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/health` | No | Any | Yes | Database health check. |
| POST | `/api/register` | No | Public | Yes | Creates a user; role defaults to `student`. |
| POST | `/api/login` | No | Any | Yes | DRF token login. Returns `token` and `user`. |
| GET | `/api/users/me` | Token | Any | Yes | Restores the authenticated user and role. |
| GET | `/api/events` | Token | Student/Organizer | Yes | Students see published events; organizers see their own. |
| POST | `/api/events` | Token | Organizer | Yes | Creates a draft event. |
| GET | `/api/events/:id` | Token | Student/Organizer | Yes | Event details. |
| PUT | `/api/events/:id` | Token | Organizer owner | Yes | Edits an event while permitted. |
| POST | `/api/events/:id/publish` | Token | Organizer owner | Yes | Publishes a draft event. |
| POST | `/api/events/:id/cancel` | Token | Organizer owner | Yes | Cancels an event. |
| POST | `/api/events/:id/registrations` | Token | Student | Yes | Registers the student as confirmed or waitlisted. |
| GET | `/api/events/:id/registrations` | Token | Organizer owner | Yes | Confirmed registration list. |
| GET | `/api/events/:id/waitlist` | Token | Organizer owner | Yes | FIFO waitlist. |
| GET | `/api/registrations/me` | Token | Student | Yes | Current student's registrations. |
| DELETE | `/api/registrations/:id` | Token | Student owner | Yes | Cancels own registration. |

## Backend Notes

- The integrated backend uses DRF token authentication with `Authorization: Token <token>`.
- CORS is configured for local Vite origins: `http://localhost:3000`, `http://localhost:5173`, `http://127.0.0.1:3000`, and `http://127.0.0.1:5173`.
- The incoming archive contained hardcoded remote MySQL credentials. Those were not copied into this repository. Local development keeps the existing SQLite configuration.
- API docs are available at `/api/docs/` when the Django server is running.
