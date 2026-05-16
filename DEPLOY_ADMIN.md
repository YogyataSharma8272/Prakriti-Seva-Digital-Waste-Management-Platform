# Deploying Admin (Vercel)

This project includes a dedicated admin page at `admin.html` and a production build target that outputs to `dist/`.

Quick steps to deploy the admin on Vercel:

1. Ensure your repo is pushed to GitHub (already done).
2. In Vercel: New Project → Import Git Repository → select this repo.
3. Project settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add these Environment Variables (Production):
   - `VITE_CORE_API_BASE_URL` = https://your-backend.example.com/api
   - `VITE_COMMERCE_API_BASE_URL` = https://your-commerce.example.com/api (optional)
   - `VITE_GOOGLE_CLIENT_ID` = <your-google-client-id> (optional)
   - Optional backend demo auth overrides if you want a quick login without MongoDB:
     - `ADMIN_DEMO_EMAIL` = admin@prakriti.seva
     - `ADMIN_DEMO_PASSWORD` = admin123
     - `ADMIN_DEMO_NAME` = Admin
5. Deploy. After success open: `https://<your-vercel-app>.vercel.app/admin.html`

Notes
- This repo already contains `vercel.json` which rewrites `/` → `/admin.html` so the admin will be served at root after deploy.
- The admin UI needs the backend reachable at `VITE_CORE_API_BASE_URL` for API calls; ensure the backend CORS allows the Vercel origin.
- If MongoDB is not configured on the auth backend, it will now start in demo auth mode and accept the demo admin credentials above.
- To set env vars via CLI: `vercel env add NAME production` and paste the value when prompted.

If you want, I can also add a short `README` entry or set up a DNS/subdomain guide—tell me which and I'll add it.
