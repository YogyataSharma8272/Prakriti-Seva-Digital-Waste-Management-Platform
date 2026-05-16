const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const storageFile = path.join(__dirname, '..', 'data', 'products.json');

const seedProducts = [
  {
    id: 'demo-product-1',
    title: 'Upcycled Jute Tote',
    price: 249,
    image: null,
    description: 'Handmade tote bag from recycled jute and fabric scraps',
    category: 'eco-friendly',
    quantity: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-product-2',
    title: 'Recycled Paper Notebook',
    price: 99,
    image: null,
    description: 'A5 notebook made from 100% post-consumer paper',
    category: 'eco-friendly',
    quantity: 24,
    createdAt: new Date().toISOString(),
  },
];

async function ensureStorage() {
  try {
    await fs.access(storageFile);
  } catch {
    await fs.mkdir(path.dirname(storageFile), { recursive: true });
    await fs.writeFile(storageFile, JSON.stringify(seedProducts, null, 2), 'utf8');
  }
}

async function readProducts() {
  await ensureStorage();
  const content = await fs.readFile(storageFile, 'utf8');
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeProducts(products) {
  await fs.mkdir(path.dirname(storageFile), { recursive: true });
  await fs.writeFile(storageFile, JSON.stringify(products, null, 2), 'utf8');
}

router.get('/', async (req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find((item) => String(item.id) === String(req.params.id));
    if (!product) return res.status(404).json({ error: 'product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch product' });
  }
});

router.post('/', async (req, res) => {
  const { title, price, image, description, category, quantity } = req.body;
  if (!title || typeof price === 'undefined') return res.status(400).json({ error: 'title and price required' });

  try {
    const products = await readProducts();
    const product = {
      id: `product-${Date.now()}`,
      title,
      price: Number(price),
      image: image || null,
      description: description || '',
      category: category || 'eco-friendly',
      quantity: Number(quantity || 0),
      createdAt: new Date().toISOString(),
    };

    await writeProducts([product, ...products]);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'failed to add product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const index = products.findIndex((item) => String(item.id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'product not found' });

    const updated = { ...products[index], ...req.body, id: products[index].id };
    products[index] = updated;
    await writeProducts(products);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const nextProducts = products.filter((item) => String(item.id) !== String(req.params.id));
    if (nextProducts.length === products.length) return res.status(404).json({ error: 'product not found' });
    await writeProducts(nextProducts);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'failed to delete product' });
  }
});

module.exports = router;