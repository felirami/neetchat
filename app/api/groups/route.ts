import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/groups
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const createdBy = searchParams.get("created_by");

    let result;
    if (createdBy) {
      result = await query(
        "SELECT * FROM groups WHERE created_by = $1 ORDER BY created_at DESC",
        [createdBy]
      );
    } else {
      result = await query("SELECT * FROM groups ORDER BY created_at DESC");
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// POST /api/groups
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, created_by, description, avatar_url } = body;

    if (!name || !created_by) {
      return NextResponse.json(
        { error: "Name and created_by are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO groups (name, created_by, description, avatar_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, created_by, description || null, avatar_url || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

