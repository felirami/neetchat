import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/profile?wallet=0x...
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const result = await query(
      "SELECT * FROM profiles WHERE wallet = $1",
      [wallet]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST /api/profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, username, avatar_url, bio } = body;

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO profiles (wallet, username, avatar_url, bio)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (wallet) 
       DO UPDATE SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url, bio = EXCLUDED.bio
       RETURNING *`,
      [wallet, username || null, avatar_url || null, bio || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    return NextResponse.json(
      { error: "Failed to create/update profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, username, avatar_url, bio } = body;

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }
    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount++}`);
      values.push(avatar_url);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(wallet);
    const result = await query(
      `UPDATE profiles SET ${updates.join(", ")} WHERE wallet = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

