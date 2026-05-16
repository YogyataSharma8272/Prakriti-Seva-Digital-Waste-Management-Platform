
  # Prakriti Seva - The Eco Dharmik Platform

  This repository contains the code for "Prakriti Seva - The Eco Dharmik Platform." It was implemented based on a Figma design; the reference file (for attribution) is: https://www.figma.com/design/rZMN081pMcTusgZiRXBQdJ/Prakriti-Seva-Website-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start only the frontend development server.

  Run `npm run dev:all` to start frontend + both backend services together.

  If needed, start each service separately:
  - `npm run dev:backend` (auth/waste/leaderboard API on `http://localhost:5002`)
  - `npm run dev:server` (store/checkout API on `http://localhost:4000`)
  - `npm run dev:frontend` (Vite app on `http://localhost:3000`)

  Frontend API variables (optional, defaults already set):
  - `VITE_CORE_API_BASE_URL=http://localhost:5002/api`
  - `VITE_COMMERCE_API_BASE_URL=http://localhost:4000/api`

  ## Backend (optional)

  This project includes a small Express backend scaffold in `server/` to add product APIs and a Stripe-ready checkout endpoint.

  Quick start (in a new terminal):

  ```powershell
  cd c:\Users\Ashish Sahay\OneDrive\Desktop\seva\server
  npm install
  cp .env.example .env
  # edit .env to set STRIPE_SECRET_KEY if you want live Stripe
  npm start
  ```

  API endpoints provided by the scaffold:
  - `GET /api/products` - list products
  - `POST /api/products` - add a product (payload: { title, price, image?, description? })
  - `POST /api/checkout` - create an order and (if Stripe key is set) a Stripe Checkout Session

  Notes:
  - The backend uses a simple file-based JSON database (`server/db.json`) to keep demo product and order data. It's not intended for production.
  - To enable real payments, set `STRIPE_SECRET_KEY` in `server/.env` and configure `SUCCESS_URL`/`CANCEL_URL`.
  
### Backend developer notes

- Admin endpoints: `GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id` are protected by a simple API key. Set `ADMIN_API_KEY` in `server/.env` and send it in the `X-Admin-Key` header when calling those endpoints.
- Stripe webhook: `/api/webhooks/stripe` verifies Stripe signatures using `STRIPE_WEBHOOK_SECRET`. Use the Stripe CLI to forward test webhooks or set the webhook endpoint in your Stripe dashboard.

Example `.env` (copy `server/.env.example` to `server/.env` and fill values):

```
PORT=4000
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# SUCCESS_URL=http://localhost:5173/success
# CANCEL_URL=http://localhost:5173/cancel
# ADMIN_API_KEY=some-secret-key
```

Start the backend (dev):

```powershell
cd server
npm install
npm run dev
```

Test the health endpoint:

```powershell
curl http://localhost:4000/api/health
# should return { "ok": true }
```

Main backend health (auth/waste service):

```powershell
curl http://localhost:5002/
```
  