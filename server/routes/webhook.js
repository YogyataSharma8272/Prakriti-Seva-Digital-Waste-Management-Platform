const express = require('express');
const router = express.Router();
const db = require('../db');
const Stripe = require('stripe');

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
let stripe = null;
if (stripeSecret) stripe = Stripe(stripeSecret);

// This route expects the raw body. The server will mount it with express.raw in index.js.
router.post('/', async (req, res) => {
  if (!webhookSecret) {
    return res.status(400).json({ error: 'webhook secret not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata && session.metadata.orderId;
    if (orderId) {
      db.updateOrder(orderId, { status: 'paid', paidAt: new Date().toISOString(), stripeSessionId: session.id });
      console.log(`Order ${orderId} marked as paid via webhook`);
    }
  }

  res.json({ received: true });
});

module.exports = router;
