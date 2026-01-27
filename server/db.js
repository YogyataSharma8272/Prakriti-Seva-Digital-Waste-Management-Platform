const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { products: [], orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  getProducts() {
    return readDB().products;
  },
  addProduct(product) {
    const db = readDB();
    db.products.push(product);
    writeDB(db);
    return product;
  },
  getProductById(id) {
    return readDB().products.find((p) => String(p.id) === String(id));
  },
  addOrder(order) {
    const db = readDB();
    db.orders.push(order);
    writeDB(db);
    return order;
  },
  getOrders() {
    return readDB().orders || [];
  },
  getOrderById(id) {
    return (readDB().orders || []).find((o) => String(o.id) === String(id));
  },
  updateOrder(id, patch) {
    const db = readDB();
    const idx = (db.orders || []).findIndex((o) => String(o.id) === String(id));
    if (idx === -1) return null;
    db.orders[idx] = Object.assign({}, db.orders[idx], patch);
    writeDB(db);
    return db.orders[idx];
  },
};

