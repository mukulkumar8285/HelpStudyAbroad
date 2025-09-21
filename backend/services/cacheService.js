const Redis = require("ioredis");

// Fallback to localhost if REDIS_URL not set
const redis = new Redis(process.env.REDIS_URL || {
  host: "127.0.0.1",
  port: 6379
});

// Event listeners
redis.on("connect", () => console.log("Connected to Redis!"));
redis.on("error", (err) => console.warn("Redis error:", err.message));

// Helper functions
const get = (key) => redis.get(key);
const set = (key, value, ttl = 60) =>
  redis.set(key, value, "EX", ttl);

module.exports = { get, set };
