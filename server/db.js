const mongoose = require('mongoose');
const Product = require('./models/Product');

let isConnected = false;

const checkoutOrderSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true, unique: true },
    productId: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    amount: { type: Number, required: true },
    status: { type: String, default: 'created' },
    paidAt: Date,
    stripeSessionId: String,
  },
  { timestamps: true }
);

const CheckoutOrder = mongoose.models.CheckoutOrder || mongoose.model('CheckoutOrder', checkoutOrderSchema);

async function connect() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it in server/.env to connect MongoDB.');
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  });
  isConnected = true;
}

function normalizeProduct(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: String(obj._id),
  };
}

function normalizeOrder(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj.id,
  };
}

module.exports = {
  connect,

  async getProducts() {
    await connect();
    const products = await Product.find().sort({ createdAt: -1 });
    return products.map(normalizeProduct);
  },

  async addProduct(product) {
    await connect();
    const created = await Product.create({
      title: product.title,
      description: product.description || '',
      price: Number(product.price),
      category: product.category || 'eco-friendly',
      image: product.image || null,
      quantity: Number(product.quantity || 0),
      createdAt: product.createdAt || new Date(),
      updatedAt: new Date(),
    });
    return normalizeProduct(created);
  },

  async updateProduct(id, patch) {
    await connect();
    const updated = await Product.findByIdAndUpdate(
      id,
      { ...patch, updatedAt: new Date() },
      { new: true }
    );
    return updated ? normalizeProduct(updated) : null;
  },

  async deleteProduct(id) {
    await connect();
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  },

  async getProductById(id) {
    await connect();
    const product = await Product.findById(id);
    return product ? normalizeProduct(product) : null;
  },

  async addOrder(order) {
    await connect();
    const created = await CheckoutOrder.create({
      id: Number(order.id || Date.now()),
      productId: String(order.productId),
      quantity: Number(order.quantity || 1),
      amount: Number(order.amount || 0),
      status: order.status || 'created',
      paidAt: order.paidAt,
      stripeSessionId: order.stripeSessionId,
    });
    return normalizeOrder(created);
  },

  async getOrders() {
    await connect();
    const orders = await CheckoutOrder.find().sort({ createdAt: -1 });
    return orders.map(normalizeOrder);
  },

  async getOrderById(id) {
    await connect();
    const order = await CheckoutOrder.findOne({ id: Number(id) });
    return order ? normalizeOrder(order) : null;
  },

  async updateOrder(id, patch) {
    await connect();
    const updated = await CheckoutOrder.findOneAndUpdate(
      { id: Number(id) },
      { ...patch },
      { new: true }
    );
    return updated ? normalizeOrder(updated) : null;
  },
};

