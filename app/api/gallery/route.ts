import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataPath = path.join(process.cwd(), "data", "gallery.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function writeData(data: unknown) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    return NextResponse.json(readData());
  } catch {
    return NextResponse.json({ error: "Failed to read gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = readData();
    const newItem = {
      id: `gal${Date.now()}`,
      title: body.title,
      category: body.category || "Dishes",
      image: body.image || "",
      description: body.description || "",
      isFeatured: body.isFeatured ?? false,
    };
    data.push(newItem);
    writeData(data);
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = readData();
    const idx = data.findIndex((g: { id: string }) => g.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data[idx] = { ...data[idx], ...body };
    writeData(data);
    return NextResponse.json(data[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = readData();
    writeData(data.filter((g: { id: string }) => g.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
