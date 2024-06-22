import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const key = searchParams.get("key");
  const users = searchParams.get("users");

  try {
    if (!name || !key || !users)
      throw new Error("name and key and users required");
    await sql`INSERT INTO projects (name, key, users) VALUES (${name}, ${key}, ${users});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const projects = await sql`SELECT * FROM projects WHERE key=${key};`;
  return NextResponse.json({ projects }, { status: 200 });
}
