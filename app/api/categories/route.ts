import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataPath = path.join(process.cwd(), "data", "categories.json");

function readData() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: unknown) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = readData();
    const newItem = {
      id: `cat${Date.now()}`,
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      icon: body.icon || "🍽️",
      order: data.length + 1,
      isActive: body.isActive ?? true,
    };
    data.push(newItem);
    writeData(data);
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = readData();
    const idx = data.findIndex((c: { id: string }) => c.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data[idx] = { ...data[idx], ...body };
    writeData(data);
    return NextResponse.json(data[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = readData();
    const filtered = data.filter((c: { id: string }) => c.id !== id);
    writeData(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
