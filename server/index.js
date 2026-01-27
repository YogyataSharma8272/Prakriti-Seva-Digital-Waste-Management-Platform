require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const checkoutRouter = require('./routes/checkout');
const ordersRouter = require('./routes/orders');
const webhookRouter = require('./routes/webhook');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/products', productsRouter);
app.use('/api/checkout', checkoutRouter);

// Orders endpoints (admin)
app.use('/api/orders', ordersRouter);

// Stripe webhook expects raw body; mount before json body parser for that route
app.post('/api/webhooks/stripe', require('express').raw({ type: 'application/json' }), (req, res, next) => {
  // forward raw body to webhook handler
  req.rawBody = req.body;
  next();
}, webhookRouter);

// Seed sample recycled products if DB is empty
const db = require('./db');
function seedProductsIfEmpty() {
  try {
    const products = db.getProducts();
    if (!products || products.length === 0) {
      const sample = [
        {
          id: 1001,
          title: 'Upcycled Jute Tote',
          price: 249,
          image: null,
          description: 'Handmade tote bag from recycled jute and fabric scraps',
          createdAt: new Date().toISOString(),
        },
        {
          id: 1002,
          title: 'Recycled Paper Notebook',
          price: 99,
          image: null,
          description: 'A5 notebook made from 100% post-consumer paper',
          createdAt: new Date().toISOString(),
        },
      ];
      sample.forEach((p) => db.addProduct(p));
      console.log('Seeded sample products');
    }
  } catch (err) {
    console.error('Failed to seed products', err);
  }
}

seedProductsIfEmpty();

// A simple mock success page for when Stripe isn't configured
app.get('/mock-checkout-success', (req, res) => {
  const { orderId } = req.query;
  res.send(`<h1>Mock checkout success</h1><p>Order ${orderId} recorded. Implement Stripe key to enable real payments.</p>`);
});

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
