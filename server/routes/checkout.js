const express = require('express');
const router = express.Router();
const db = require('../db');
const Stripe = require('stripe');

const stripeSecret = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeSecret) stripe = Stripe(stripeSecret);

// POST /api/checkout - create a checkout session for a product
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = db.getProductById(productId);
    if (!product) return res.status(404).json({ error: 'product not found' });

    const order = {
      id: Date.now(),
      productId: product.id,
      quantity,
      amount: product.price * quantity,
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    db.addOrder(order);

    if (!stripe) {
      // No Stripe key provided: return a mock confirmation URL
      return res.json({ url: `/mock-checkout-success?orderId=${order.id}`, order });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: product.title, description: product.description || undefined },
            unit_amount: Math.round(product.price * 100),
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.SUCCESS_URL || 'https://example.com'}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CANCEL_URL || 'https://example.com'}`,
      metadata: { orderId: String(order.id) },
    });

    res.json({ url: session.url, sessionId: session.id, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
