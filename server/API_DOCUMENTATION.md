# Prakriti Seva Backend API Documentation

## Base URL
```
http://localhost:4000/api
```

## Database
- **MongoDB** - For all data persistence
- **Default URI**: `mongodb://localhost:27017/prakriti-seva`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes (`/auth`)

### 1. Register User
**POST** `/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

---

### 2. Login User
**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "wasteCollected": 50,
    "points": 500
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`
- **Auth Required**: Yes

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "wasteCollected": 50,
    "points": 500,
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    }
  }
}
```

---

### 4. Update User Profile
**PUT** `/auth/profile`
- **Auth Required**: Yes

```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": {
    "street": "456 New St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India"
  }
}
```

---

## 🛍️ Products Routes (`/products`)

### 1. Get All Products
**GET** `/products?category=eco-friendly`

**Query Parameters:**
- `category` (optional): `upcycled`, `organic`, `eco-friendly`, `zero-waste`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "productId",
      "title": "Eco Bottle",
      "description": "Reusable water bottle",
      "price": 299,
      "category": "eco-friendly",
      "image": "url",
      "quantity": 100,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Get Product by ID
**GET** `/products/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "productId",
    "title": "Eco Bottle",
    "price": 299
  }
}
```

---

### 3. Create Product (Admin)
**POST** `/products`

```json
{
  "title": "Upcycled Bag",
  "description": "Handmade from recycled materials",
  "price": 599,
  "category": "upcycled",
  "image": "url",
  "quantity": 50
}
```

---

### 4. Update Product (Admin)
**PUT** `/products/:id`

```json
{
  "price": 699,
  "quantity": 40
}
```

---

### 5. Delete Product (Admin)
**DELETE** `/products/:id`

---

## 💳 Payment Routes (`/payment`) - Razorpay Integration

### 1. Create Razorpay Order
**POST** `/payment/create-razorpay-order`
- **Auth Required**: Yes

```json
{
  "items": [
    {
      "productId": "productId",
      "title": "Eco Bottle",
      "price": 299,
      "quantity": 2
    }
  ],
  "totalAmount": 598,
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "razorpayOrder": {
    "id": "order_xxxxx",
    "amount": 59800,
    "currency": "INR"
  },
  "orderId": "mongoOrderId"
}
```

---

### 2. Verify Razorpay Payment
**POST** `/payment/verify-razorpay-payment`
- **Auth Required**: Yes

```json
{
  "razorpayPaymentId": "pay_xxxxx",
  "razorpayOrderId": "order_xxxxx",
  "razorpaySignature": "signature",
  "orderId": "mongoOrderId"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "order": {
    "_id": "mongoOrderId",
    "paymentStatus": "completed",
    "orderStatus": "processing"
  }
}
```

---

### 3. Get User Orders
**GET** `/payment`
- **Auth Required**: Yes

---

### 4. Get Order Details
**GET** `/payment/:id`
- **Auth Required**: Yes

---

## ♻️ Waste Collection Routes (`/waste`)

### 1. Request Waste Pickup
**POST** `/waste/request-pickup`
- **Auth Required**: Yes

```json
{
  "weight": 5,
  "wasteType": "plastic",
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "address": "Mumbai, Maharashtra"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pickup request created successfully",
  "data": {
    "_id": "wasteId",
    "weight": 5,
    "wasteType": "plastic",
    "status": "scheduled",
    "pointsEarned": 50
  },
  "pointsEarned": 50
}
```

---

### 2. Get My Collections
**GET** `/waste/my-collections`
- **Auth Required**: Yes

**Response:**
```json
{
  "success": true,
  "totalWaste": 25,
  "totalPoints": 250,
  "count": 3,
  "data": [
    {
      "_id": "wasteId",
      "weight": 5,
      "wasteType": "plastic",
      "status": "picked-up",
      "pointsEarned": 50
    }
  ]
}
```

---

### 3. Get All Collections (Admin)
**GET** `/waste?status=scheduled`

**Query Parameters:**
- `status` (optional): `scheduled`, `picked-up`, `processed`, `recycled`

---

### 4. Update Collection Status (Admin)
**PUT** `/waste/:id`

```json
{
  "status": "picked-up"
}
```

---

## 🏆 Leaderboard Routes (`/leaderboard`)

### 1. Get Global Leaderboard
**GET** `/leaderboard`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "rank": 1,
      "name": "Eco Warrior",
      "wasteCollected": 500,
      "points": 5000
    },
    {
      "rank": 2,
      "name": "Green Hero",
      "wasteCollected": 400,
      "points": 4000
    }
  ]
}
```

---

### 2. Get User Rank
**GET** `/leaderboard/rank/:userId`

**Response:**
```json
{
  "success": true,
  "data": {
    "rank": 5,
    "name": "John Doe",
    "wasteCollected": 250,
    "points": 2500
  }
}
```

---

## 🛒 Orders Routes (`/orders`)

(Existing endpoints maintained from legacy code)

---

## 📊 Points System

- **1 kg waste collected = 10 points**
- Points are automatically awarded when waste pickup is requested
- Users can track their total points in their profile

---

## 🔑 Razorpay Integration Steps

1. **Sign up** at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. **Get API Keys** from Settings > API Keys
3. **Add to .env**:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
4. **Test Keys** start with `rzp_test_`
5. **Live Keys** start with `rzp_live_`

---

## 🗄️ MongoDB Collections

1. **users** - User accounts and profiles
2. **products** - Eco-friendly products
3. **orders** - Purchase orders with payment info
4. **wastecollections** - Waste pickup requests and tracking

---

## 🚀 Running the Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

---

## ✅ Health Check
**GET** `/api/health`

**Response:**
```json
{
  "ok": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🛡️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes

- Tokens expire in 7 days
- Passwords are hashed with bcrypt
- All amounts are in INR (Indian Rupees)
- MongoDB must be running before starting the server
