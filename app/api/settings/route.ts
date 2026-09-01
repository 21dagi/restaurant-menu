import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataPath = path.join(process.cwd(), "data", "settings.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function writeData(data: unknown) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const data = readData();
    // Never expose adminPin to clients
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adminPin: _, ...publicSettings } = data;
    return NextResponse.json(publicSettings);
  } catch {
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readData();
    const updated = { ...current, ...body };
    writeData(updated);
    const { adminPin: _, ...publicSettings } = updated;
    return NextResponse.json(publicSettings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
