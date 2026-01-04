import { redisClient } from "../cache/redisClient.js";

const RATE_LIMIT = 1000; // Requests per minute
const WINDOW_SIZE = 60; // 1 minute

export const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const window = Math.floor(Date.now() / 1000 / WINDOW_SIZE);
    const key = `${ip}:${window}`;

    const currentCount = await redisClient.incr(key);

    if(currentCount === 1) {
        await redisClient.expire(key, WINDOW_SIZE);
    }

    if(currentCount > RATE_LIMIT) {
        return res.status(429).json({ message: "Too many requests, please try again later." });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
};