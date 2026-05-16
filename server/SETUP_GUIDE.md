# Backend Setup Guide - Prakriti Seva

## Prerequisites

- Node.js v14 or higher
- MongoDB (local or cloud - MongoDB Atlas)
- Razorpay account (for payments)

## Installation Steps

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Or use Windows Subsystem for Linux (WSL)

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Replace `MONGODB_URI` in `.env`

### 3. Configure Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/prakriti-seva

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Razorpay Keys (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Server
PORT=4000
NODE_ENV=development
```

### 4. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to Settings → API Keys
3. Copy your Key ID and Key Secret
4. **Test Mode**: Use keys starting with `rzp_test_`
5. Add them to `.env` file

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Verify Server is Running

```bash
# Test health endpoint
curl http://localhost:4000/api/health

# Expected response:
# {"ok":true,"message":"Server is running","timestamp":"..."}
```

## MongoDB Setup (Windows)

### Option 1: MongoDB Community Edition

1. Download from: https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Install MongoDB as a Service"
4. MongoDB will start automatically
5. Default connection: `mongodb://localhost:27017`

### Option 2: MongoDB Atlas (Recommended for Beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new project
4. Create a cluster (Free tier available)
5. Whitelist your IP
6. Create database user
7. Get connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/prakriti-seva
   ```
8. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prakriti-seva
   ```

## API Endpoints

### Health Check
```bash
GET http://localhost:4000/api/health
```

### Authentication
```bash
# Register
POST http://localhost:4000/api/auth/register

# Login
POST http://localhost:4000/api/auth/login

# Get Current User
GET http://localhost:4000/api/auth/me
```

### Products
```bash
# Get all products
GET http://localhost:4000/api/products

# Get single product
GET http://localhost:4000/api/products/:id

# Create product (admin)
POST http://localhost:4000/api/products
```

### Waste Collection
```bash
# Request pickup
POST http://localhost:4000/api/waste/request-pickup

# Get my collections
GET http://localhost:4000/api/waste/my-collections
```

### Payments (Razorpay)
```bash
# Create order
POST http://localhost:4000/api/payment/create-razorpay-order

# Verify payment
POST http://localhost:4000/api/payment/verify-razorpay-payment
```

### Leaderboard
```bash
# Get global leaderboard
GET http://localhost:4000/api/leaderboard

# Get user rank
GET http://localhost:4000/api/leaderboard/rank/:userId
```

## Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import collection from `postman-collection.json` (if available)
3. Set base URL to `http://localhost:4000/api`
4. Test endpoints

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify port 27017 is not blocked

### Razorpay Keys Not Working
```
Error: Invalid API Key
```
**Solution**:
- Get fresh keys from https://dashboard.razorpay.com
- Ensure using test keys (starts with `rzp_test_`)
- Check `.env` file is correct

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution**:
- Kill process on port 4000: `netstat -ano | findstr :4000`
- Or change `PORT` in `.env` file

### JWT Token Expired
```
Error: Invalid or expired token
```
**Solution**:
- Login again to get a new token
- Tokens expire in 7 days

## Features Implemented

✅ User Authentication (Register/Login)
✅ User Profiles with Waste Tracking
✅ Product Management (CRUD)
✅ Razorpay Payment Integration
✅ Order Management
✅ Waste Collection Tracking
✅ Points System (10 points per kg)
✅ Leaderboard
✅ JWT Authentication
✅ Password Hashing (bcrypt)
✅ Error Handling
✅ MongoDB Integration

## File Structure

```
server/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── WasteCollection.js
├── routes/              # API routes
│   ├── auth.js
│   ├── products.js
│   ├── payment.js
│   ├── waste.js
│   ├── leaderboard.js
│   └── orders.js
├── middleware/          # Express middleware
│   ├── auth.js
│   └── errorHandler.js
├── utils/               # Helper functions
│   ├── auth.js
│   └── password.js
├── index.js             # Main server file
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Next Steps

1. ✅ Setup MongoDB
2. ✅ Configure Razorpay API keys
3. ✅ Start server: `npm run dev`
4. ✅ Test endpoints with Postman
5. Connect frontend to backend APIs
6. Deploy to production

## Support

For issues, check:
- API_DOCUMENTATION.md for endpoint details
- Server console logs for error messages
- .env file for configuration

Happy coding! 🚀
