import { Pool } from "pg";

// Database connection pool
let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "neetchat",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

// Initialize database schema
export async function initDb() {
  const db = getDbPool();
  
  try {
    // Create profiles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet TEXT UNIQUE NOT NULL,
        username TEXT,
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create contacts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        contact_wallet TEXT NOT NULL,
        pinned BOOLEAN DEFAULT FALSE,
        blocked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, contact_wallet)
      );
    `);

    // Create groups table
    await db.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_by TEXT NOT NULL,
        description TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create files table
    await db.query(`
      CREATE TABLE IF NOT EXISTS files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cid TEXT NOT NULL,
        uploader TEXT NOT NULL,
        mime TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet);
      CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
      CREATE INDEX IF NOT EXISTS idx_contacts_contact_wallet ON contacts(contact_wallet);
      CREATE INDEX IF NOT EXISTS idx_files_cid ON files(cid);
    `);

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

// Helper function to query database
export async function query(text: string, params?: any[]) {
  const db = getDbPool();
  return db.query(text, params);
}

