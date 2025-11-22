import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/files?cid=... or /api/files?uploader=0x...
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cid = searchParams.get("cid");
    const uploader = searchParams.get("uploader");

    let result;
    if (cid) {
      result = await query("SELECT * FROM files WHERE cid = $1", [cid]);
    } else if (uploader) {
      result = await query(
        "SELECT * FROM files WHERE uploader = $1 ORDER BY created_at DESC",
        [uploader]
      );
    } else {
      result = await query("SELECT * FROM files ORDER BY created_at DESC LIMIT 100");
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

// POST /api/files
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cid, uploader, mime } = body;

    if (!cid || !uploader) {
      return NextResponse.json(
        { error: "CID and uploader are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO files (cid, uploader, mime)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cid, uploader, mime || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating file record:", error);
    return NextResponse.json(
      { error: "Failed to create file record" },
      { status: 500 }
    );
  }
}

