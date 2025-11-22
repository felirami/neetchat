import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";

// POST /api/init-db - Initialize database schema
export async function POST() {
  try {
    await initDb();
    return NextResponse.json({ message: "Database initialized successfully" });
  } catch (error: any) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize database" },
      { status: 500 }
    );
  }
}

