const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 30 }); // 30 seconds cache

exports.cacheMiddleware = (keyFn) => (req, res, next) => {
  const key = keyFn(req);

  const cachedData = cache.get(key);
  if (cachedData) return res.json(cachedData);

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body);
    return originalJson(body);
  };

  next();
};

exports.cache = cache;