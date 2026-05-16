const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products - list products
router.get('/', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch products' });
  }
});

// POST /api/products - add product (admin)
router.post('/', async (req, res) => {
  const { title, price, image, description, category, quantity } = req.body;
  if (!title || typeof price === 'undefined') return res.status(400).json({ error: 'title and price required' });

  try {
    const product = await db.addProduct({
      title,
      price: Number(price),
      image: image || null,
      description: description || '',
      category: category || 'eco-friendly',
      quantity: Number(quantity || 0),
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'failed to add product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'failed to delete product' });
  }
});

module.exports = router;
