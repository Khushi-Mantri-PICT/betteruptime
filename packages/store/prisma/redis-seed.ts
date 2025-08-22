import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const client = createClient({ url: REDIS_URL });

async function seed() {
  console.log(`Connecting to Redis at ${REDIS_URL}...`);
  await client.connect();
  
  try {
    await client.xGroupCreate("betteruptime:website", "f5a13f6c-8e91-42b8-9c0e-07b4567a98e0", "$", { MKSTREAM: true });
    console.log("✅ Created consumer group f5a13f6c-8e91-42b8-9c0e-07b4567a98e0");
  } catch (e: any) {
    console.log("ℹ️ Consumer group f5a13f6c-8e91-42b8-9c0e-07b4567a98e0 already exists or error:", e.message);
  }
  
  try {
    await client.xGroupCreate("betteruptime:website", "32c9087b-7c53-4d84-8b63-32517cbd17c3", "$", { MKSTREAM: true });
    console.log("✅ Created consumer group 32c9087b-7c53-4d84-8b63-32517cbd17c3");
  } catch (e: any) {
    console.log("ℹ️ Consumer group 32c9087b-7c53-4d84-8b63-32517cbd17c3 already exists or error:", e.message);
  }
  
  console.log("✅ Redis Groups Created");
  await client.quit();
}