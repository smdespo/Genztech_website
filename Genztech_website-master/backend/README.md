# Genztech Backend

Node.js + Express + MongoDB backend for the Genztech skill-assessment website.
Captures user signups/logins and every form submission (enquiries, enrollments,
applications, free counselling). The site owner can browse everything from the
existing `adminpanel.html`, gated by an admin password.

## Endpoints (matched to the existing frontend)

| Method | Path               | Used by                                            |
|--------|--------------------|----------------------------------------------------|
| POST   | `/signup`          | `signuppage.html`                                  |
| POST   | `/login`           | `loginpage.html`                                   |
| POST   | `/enroll`          | "Enroll for Courses" modal (every page)            |
| POST   | `/apply`           | "Apply" modal (internships / placement)            |
| POST   | `/query`           | Contact / enquiry forms                            |
| POST   | `/book_session`    | "Free Counselling" form                            |
| POST   | `/admin/login`     | Admin login overlay on `adminpanel.html`           |
| GET    | `/admin/dashboard` | `adminpanel.html` (requires `Bearer` admin token)  |
| GET    | `/admin/users`     | Optional — list of registered users                |
| GET    | `/health`          | Render health check                                |

## 1. Local development

```bash
cd backend
npm install
cp .env.example .env   # then edit values
npm run dev
```

The server listens on `http://127.0.0.1:8000` by default — which is exactly what
`assets/js/genztech.js` falls back to when it sees `localhost`, so open the
HTML files in a Live Server / `python -m http.server` and the forms will hit
this backend automatically.

## 2. MongoDB Atlas (free cluster)

1. Sign up at <https://www.mongodb.com/cloud/atlas/register>.
2. Build a **free M0 cluster** (any region near your users).
3. Database Access → **Add new database user** (username + password).
4. Network Access → **Add IP `0.0.0.0/0`** so Render can reach it (you can
   tighten this to Render's egress IPs later).
5. Click **Connect → Drivers**, copy the `mongodb+srv://…` URI, replace
   `<password>` with your DB user's password, and append the DB name, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/genztech?retryWrites=true&w=majority`.
6. Put it in `.env` as `MONGODB_URI=…` (and in Render env vars for prod).

Collections are created automatically on first insert:
`users`, `enquiries`, `enrollments`, `applications`, `counsellings`.

## 3. Deploy on Render

1. Push this whole repo to GitHub.
2. <https://dashboard.render.com> → **New → Web Service** → connect the repo.
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. **Environment variables** (Render dashboard → Environment):
   - `MONGODB_URI` — the Atlas URI from step 2
   - `ADMIN_EMAIL` — what you'll type into the admin login overlay
   - `ADMIN_PASSWORD` — strong password for the admin panel
   - `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
   - `ALLOWED_ORIGINS` — your frontend Vercel URLs, comma-separated
     (e.g. `https://your-site.vercel.app,https://*.vercel.app`)
5. Deploy. After ~2 min, Render shows a public URL like
   `https://genztech-backend.onrender.com`.

## 4. Point the Vercel frontend at the Render backend

Open `assets/js/genztech.js` and replace the production URL in
`resolveApiBase()` with your actual Render URL:

```js
return 'https://genztech-backend.onrender.com';
```

Commit, push — Vercel auto-deploys. The site will use localhost when run
locally and Render when served from Vercel, because the function checks
`window.location.hostname`.

## 5. First admin login

1. Visit `/loginpage.html` on your live site → click **Open Admin Panel**
   (or go straight to `/adminpanel.html`).
2. The login overlay asks for `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. After login the token is stored in `localStorage` for 12 hours — refresh
   button reloads data, logout button clears the token.

## Notes / safety

- Passwords are hashed with bcrypt (10 rounds).
- The admin endpoints require a JWT signed with `JWT_SECRET`.
- CORS uses an explicit allowlist; `*.vercel.app` previews are matched by
  pattern when you include any entry containing `*.vercel.app`.
- Render's free tier sleeps after 15 min of inactivity; the first request
  after a sleep takes ~30 s. Upgrade the plan if that matters.
