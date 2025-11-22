import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/contacts?wallet=0x...
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

    // Get user profile ID
    const profileResult = await query(
      "SELECT id FROM profiles WHERE wallet = $1",
      [wallet]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json([]);
    }

    const userId = profileResult.rows[0].id;

    // Get contacts
    const result = await query(
      `SELECT c.*, p.wallet, p.username, p.avatar_url
       FROM contacts c
       LEFT JOIN profiles p ON c.contact_wallet = p.wallet
       WHERE c.user_id = $1
       ORDER BY c.pinned DESC, c.created_at DESC`,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST /api/contacts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, contact_wallet, pinned, blocked } = body;

    if (!wallet || !contact_wallet) {
      return NextResponse.json(
        { error: "Wallet and contact_wallet are required" },
        { status: 400 }
      );
    }

    // Get or create user profile
    const userProfile = await query(
      "SELECT id FROM profiles WHERE wallet = $1",
      [wallet]
    );

    let userId;
    if (userProfile.rows.length === 0) {
      const newProfile = await query(
        "INSERT INTO profiles (wallet) VALUES ($1) RETURNING id",
        [wallet]
      );
      userId = newProfile.rows[0].id;
    } else {
      userId = userProfile.rows[0].id;
    }

    const result = await query(
      `INSERT INTO contacts (user_id, contact_wallet, pinned, blocked)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, contact_wallet)
       DO UPDATE SET pinned = EXCLUDED.pinned, blocked = EXCLUDED.blocked
       RETURNING *`,
      [userId, contact_wallet, pinned || false, blocked || false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}

