# Smart Email Verifier (Express + MongoDB)

Mini SaaS-style backend that:
- verifies email format + MX lookup + disposable detection,
- simulates sending emails,
- tracks opens,
- returns basic analytics.

## Features / Endpoints
- `POST /api/verify` -> { email }  => { valid, reason }
- `POST /api/send`   -> { email, subject, body } => { ok, id }
- `GET  /api/open/:id` -> mark email open
- `GET  /api/analytics` -> { sentCount, validCount, openCount, validPct, openRate }

## Quick start (local)
1. Install Node.js (>=16) and MongoDB / or use MongoDB Atlas.
2. Copy `.env.example` to `.env` and set MONGODB_URI.
3. Install dependencies:
   ```
   npm install
   ```
4. Run:
   ```
   npm run dev
   ```
5. Try endpoints (example using curl):
   ```
   curl -X POST http://localhost:3000/api/verify -H "Content-Type: application/json" -d '{"email":"test@gmail.com"}'
   curl -X POST http://localhost:3000/api/send -H "Content-Type: application/json" -d '{"email":"test@example.com","subject":"Hi","body":"Hello"}'
   curl http://localhost:3000/api/analytics
   ```

## Hosting
- Use Render / Railway / Heroku. Provide `MONGODB_URI` in environment variables.

## Notes
- MX lookups may be blocked on some hosting providers — if so, fallback to format check only.
- This is a demo project intended for the Outbox Labs placement assignment walkthrough.
