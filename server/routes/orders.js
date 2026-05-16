const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple admin auth using an API key in env: ADMIN_API_KEY
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.adminKey;
  if (!process.env.ADMIN_API_KEY) return res.status(403).json({ error: 'admin key not configured' });
  if (!key || String(key) !== String(process.env.ADMIN_API_KEY)) return res.status(401).json({ error: 'unauthorized' });
  next();
}

// GET /api/orders - list orders (admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch orders' });
  }
});

// GET /api/orders/:id - get order by id (admin)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch order' });
  }
});

// PATCH /api/orders/:id - update order (admin)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const patch = req.body || {};
    const updated = await db.updateOrder(req.params.id, patch);
    if (!updated) return res.status(404).json({ error: 'order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'failed to update order' });
  }
});

module.exports = router;
