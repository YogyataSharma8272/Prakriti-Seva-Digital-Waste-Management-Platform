const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products - list products
router.get('/', (req, res) => {
  const products = db.getProducts();
  res.json(products);
});

// POST /api/products - add product (admin)
router.post('/', (req, res) => {
  const { title, price, image, description } = req.body;
  if (!title || typeof price === 'undefined') return res.status(400).json({ error: 'title and price required' });

  const product = {
    id: Date.now(),
    title,
    price: Number(price),
    image: image || null,
    description: description || '',
    createdAt: new Date().toISOString(),
  };

  db.addProduct(product);
  res.status(201).json(product);
});

module.exports = router;
