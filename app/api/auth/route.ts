import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataPath = path.join(process.cwd(), "data", "settings.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ error: "PIN required" }, { status: 400 });
    }

    const settings = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    if (pin !== settings.adminPin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_auth", "1", {
      httpOnly: true,
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_auth");
  return response;
}
