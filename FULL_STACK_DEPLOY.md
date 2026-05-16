# Full Stack Deploy Guide

This project can be deployed as:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 1) Database: MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow network access for your backend host.
4. Copy the connection string.

Example:

```text
mongodb+srv://<user>:<pass>@cluster0.mongodb.net/prakriti_seva?retryWrites=true&w=majority
```

## 2) Backend: Render

1. Create a new Render Web Service from this GitHub repo.
2. Use the `backend` folder as the root.
3. Build command:

```bash
npm install
```

4. Start command:

```bash
node server.js
```

5. Add environment variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random secret
   - `GOOGLE_CLIENT_ID` = your Google OAuth client id
   - `EMAIL_HOST` = smtp host if using email OTP
   - `EMAIL_PORT` = 587
   - `EMAIL_USER` = your email
   - `EMAIL_PASS` = your app password
   - `EMAIL_FROM` = display name + email

6. After deploy, note the backend URL, for example:

```text
https://your-backend.onrender.com
```

7. Your frontend API base URL should be:

```text
https://your-backend.onrender.com/api
```

## 3) Frontend: Vercel

1. Create a new Vercel project from the same GitHub repo.
2. Build command:

```bash
npm run build
```

3. Output directory:

```text
dist
```

4. Add environment variables:
   - `VITE_CORE_API_BASE_URL` = `https://your-backend.onrender.com/api`
   - `VITE_COMMERCE_API_BASE_URL` = your commerce backend URL if you deploy one
   - `VITE_GOOGLE_CLIENT_ID` = same Google client id if using Google login

5. Deploy.

6. Open the admin page:

```text
https://your-vercel-app.vercel.app/admin.html
```

## 4) Important Notes

- If MongoDB is not connected, the backend now runs in demo mode for admin login and dashboard data.
- Demo admin login:
  - Email: `admin@prakriti.seva`
  - Password: `admin123`
- For real production, always use MongoDB Atlas and set `MONGO_URI`.
- Keep `JWT_SECRET` different from development.
