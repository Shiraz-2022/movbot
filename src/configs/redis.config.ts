import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Replace with your Redis cloud details

export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB) || 0,
};

const redis = new Redis(redisConfig);

redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
