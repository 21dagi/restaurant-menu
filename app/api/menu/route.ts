import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataPath = path.join(process.cwd(), "data", "menu.json");

function readData() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: unknown) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req: NextRequest) {
  try {
    const data = readData();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const available = searchParams.get("available");

    let result = data;
    if (categoryId) result = result.filter((d: { categoryId: string }) => d.categoryId === categoryId);
    if (available === "true") result = result.filter((d: { isAvailable: boolean }) => d.isAvailable);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to read menu" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = readData();
    const newItem = {
      id: `dish${Date.now()}`,
      categoryId: body.categoryId,
      name: body.name,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      description: body.description || "",
      image: body.image || "/images/hero.jpg",
      spiceLevel: body.spiceLevel || "Mild",
      dietaryTags: body.dietaryTags || [],
      isAvailable: body.isAvailable ?? true,
      isChefSpecial: body.isChefSpecial ?? false,
      sortOrder: data.length + 1,
    };
    data.push(newItem);
    writeData(data);
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = readData();
    const idx = data.findIndex((d: { id: string }) => d.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data[idx] = {
      ...data[idx],
      ...body,
      price: Number(body.price ?? data[idx].price),
      originalPrice: body.originalPrice != null ? Number(body.originalPrice) : data[idx].originalPrice,
    };
    writeData(data);
    return NextResponse.json(data[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = readData();
    const filtered = data.filter((d: { id: string }) => d.id !== id);
    writeData(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
