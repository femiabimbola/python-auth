# JWT Authentication App — Walkthrough

## What Was Built

A full-stack JWT authentication system with **access token + refresh token rotation**, using **FastAPI** (backend) and **Next.js** (frontend).

### Backend (FastAPI) — Port 8000

| File | Purpose |
|------|---------|
| [main.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/main.py) | App entry with CORS and startup |
| [config.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/config.py) | Pydantic settings from .env |
| [database.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/database.py) | SQLAlchemy engine + SQLite |
| [models.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/models.py) | User & RefreshToken models |
| [schemas.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/schemas.py) | Pydantic request/response schemas |
| [auth.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/auth.py) | JWT create/verify + bcrypt hashing |
| [dependencies.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/dependencies.py) | DB session + get_current_user |
| [routers/auth.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/routers/auth.py) | Register, login, refresh, logout |
| [routers/users.py](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/backend/app/routers/users.py) | Protected /me endpoint |

**API Endpoints:**
- `POST /api/auth/register` — Create user, return token pair
- `POST /api/auth/login` — Authenticate, return token pair
- `POST /api/auth/refresh` — Rotate refresh token, return new pair
- `POST /api/auth/logout` — Revoke refresh token
- `GET /api/users/me` — Get current user (protected)

### Frontend (Next.js) — Port 3000

| File | Purpose |
|------|---------|
| [globals.css](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/app/globals.css) | Premium dark-mode design system |
| [api.ts](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/lib/api.ts) | API client with auto-refresh |
| [AuthContext.tsx](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/context/AuthContext.tsx) | React auth state management |
| [middleware.ts](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/middleware.ts) | Route protection |
| [auth route](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/app/api/auth/[...action]/route.ts) | Auth proxy with httpOnly cookies |
| [proxy route](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/app/api/proxy/[...path]/route.ts) | General API proxy |
| [Landing](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/app/page.tsx) | Hero page at `/` |
| [Login](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/app/login/page.tsx) | Login form at `/login` |
| [Register](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/app/register/page.tsx) | Register form at `/register` |
| [Dashboard](file:///C:/Users/EZ37%20Solutions/.gemini/antigravity/scratch/auth-app/frontend/src/app/dashboard/page.tsx) | Protected dashboard at `/dashboard` |

## Security Features

- **Access Token**: 15-minute expiry JWT, sent via Authorization header
- **Refresh Token**: 7-day expiry JWT with JTI, tracked in database
- **Refresh Token Rotation**: Old token revoked on each refresh; reuse detection revokes all sessions
- **httpOnly Cookies**: Tokens stored in httpOnly, Secure, SameSite cookies (not accessible to JS)
- **Password Hashing**: bcrypt via passlib
- **CORS**: Locked to frontend origin only

## Testing Results

All endpoints verified working via both direct API calls and full browser flow:

| Test | Result |
|------|--------|
| Register new user | ✅ 201 Created + tokens returned |
| Login existing user | ✅ 200 OK + tokens returned |
| Access protected route | ✅ 200 OK with user data |
| Refresh token rotation | ✅ 200 OK + new token pair |
| Logout (revoke token) | ✅ 200 OK |
| Unauthorized access | ✅ 403 Forbidden |
| Frontend register flow | ✅ Redirects to dashboard |
| Frontend login flow | ✅ Redirects to dashboard |
| Frontend logout | ✅ Redirects to login |
| Route protection | ✅ Unauthenticated → /login |

## How to Run

```bash
# Terminal 1 — Backend
cd auth-app/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd auth-app/frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.
