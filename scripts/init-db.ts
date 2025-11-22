#!/usr/bin/env ts-node

import { initDb } from "../lib/db";

async function main() {
  console.log("🚀 Initializing database...");
  try {
    await initDb();
    console.log("✅ Database initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

main();

