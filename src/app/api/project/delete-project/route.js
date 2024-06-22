import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  try {
    if (!key) throw new Error("key required");
    await sql`DELETE FROM projects WHERE key=${key};`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const projects = await sql`SELECT * FROM projects WHERE key=${key};`;
  return NextResponse.json({ projects }, { status: 200 });
}
