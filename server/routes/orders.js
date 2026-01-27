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
router.get('/', requireAdmin, (req, res) => {
  const orders = db.getOrders();
  res.json(orders);
});

// GET /api/orders/:id - get order by id (admin)
router.get('/:id', requireAdmin, (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'order not found' });
  res.json(order);
});

// PATCH /api/orders/:id - update order (admin)
router.patch('/:id', requireAdmin, (req, res) => {
  const patch = req.body || {};
  const updated = db.updateOrder(req.params.id, patch);
  if (!updated) return res.status(404).json({ error: 'order not found' });
  res.json(updated);
});

module.exports = router;
