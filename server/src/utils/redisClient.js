// utils/redisClient.js
import { createClient } from "redis";

console.log("🔍 REDIS_URL from .env:", process.env.REDIS_URL); // debug line

const redisClient = createClient({
    username: 'default',
    password: 'rr5VYaFH1bK7WvseqVmqHGU9wQFo5c3u',
    socket: {
        host: 'redis-10363.c92.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 10363
    }
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis Cloud connected");
  }
};

export { redisClient, connectRedis };