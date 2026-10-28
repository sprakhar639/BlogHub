# BlogHub — Full-stack blog platform

BlogHub is a React + Express + MongoDB application for publishing and reading community stories. This version keeps your original MERN architecture and improves the UI, API consistency, authentication state, ownership checks, loading/error states, and responsive layout.

## Features
- Register and log in using username or email; session token stored in an HTTP-only cookie.
- Discover public stories with search, newest/oldest sorting, pagination, author and reading-time metadata.
- Create, edit, and delete your own stories. Backend checks ownership before update/delete.
- Profile page with your published stories.
- Responsive editorial-style UI with pastel colour panels, hover transitions, small floating elements, and reduced-motion support.
- API health endpoint: `GET /api/health`.

## Requirements
- Node.js 20.19+ or 22.12+ recommended (Vite 8 requires a modern Node version).
- MongoDB Atlas or local MongoDB.
- npm.

## Run locally

### 1. Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and set:
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: long random secret; do not commit it.
- `CLIENT_URL=http://localhost:5173`

Then run:
```bash
npm run dev
```
API runs at `http://localhost:3000`. Confirm `http://localhost:3000/api/health` returns `{ "status": "ok", ... }`.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env` if you need to change the API address. Then:
```bash
npm run dev
```
Open `http://localhost:5173`.

## API overview
| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account and start session |
| POST | `/api/auth/login` | No | Start session |
| POST | `/api/auth/logout` | No | Clear session cookie |
| GET | `/api/auth/me` | Yes | Return current user |
| GET | `/api/blog?page=1&limit=9&search=&sort=newest` | No | Browse/search stories |
| GET | `/api/blog/:id` | No | Read story |
| GET | `/api/blog/mine` | Yes | Current user's stories |
| POST | `/api/blog` | Yes | Publish story |
| PUT | `/api/blog/:id` | Owner | Update story |
| DELETE | `/api/blog/:id` | Owner | Delete story |
| GET | `/api/user/me` | Yes | Current user's profile |

## Suggested Git commits
These are intentionally grouped by feature so the history is readable. If you are continuing an existing repository, inspect `git status` first and do not overwrite work you need.

```bash
git add backend/src backend/server.js backend/package.json backend/.env.example
git commit -m "fix(api): harden auth and enforce blog ownership"

git add frontend/src/context frontend/src/api frontend/src/components frontend/src/pages/Login.jsx frontend/src/pages/register.jsx
git commit -m "feat(auth): sync session state and improve account flows"

git add frontend/src/App.jsx frontend/src/index.css frontend/src/App.css frontend/src/pages/home.jsx frontend/src/pages/blogDetails.jsx frontend/src/pages/createBlog.jsx frontend/src/pages/editBlog.jsx frontend/src/pages/getMyProfile.jsx frontend/src/pages/NotFound.jsx frontend/.env.example README.md .gitignore
git commit -m "feat(ui): build responsive BlogHub reading experience"
```

## Before deploying
- Use HTTPS and set `NODE_ENV=production`; secure cookies require HTTPS in production.
- Set `CLIENT_URL` to your exact deployed frontend origin.
- Use a strong unique `JWT_SECRET`; never expose `.env` or commit secrets.
- Configure MongoDB Atlas network access and database credentials safely.
- Run `npm run build` in `frontend` and test register/login/create/edit/delete on the deployed domains. If frontend and API are on different sites, cookie `SameSite`/`Secure` settings may need adjustment and CSRF protection should be added.
