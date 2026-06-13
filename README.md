### Local Installation for backend
1. cd backend
2. uv venv
3. source .venv/Scripts/activate
4. uv pip install -r requirement.txt

### Local Installation for frontend
1. cd frontend
2. npm install

### Automated Tests
1. Start FastAPI backend: `uvicorn app.main:app --reload --port 8000`
2. Start Next.js frontend: `npm run dev` (port 3000)
3. Test the full flow in the browser:
   - Register a new user
   - Login with credentials
   - View dashboard (protected route)
   - Logout and verify redirect
   - Verify unauthorized access is blocked
