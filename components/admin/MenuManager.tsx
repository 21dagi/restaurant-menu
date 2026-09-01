"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, ToggleLeft, ToggleRight, Star, ChefHat, Search, Coffee, Droplets, Sparkles, Flame } from "lucide-react";
import Image from "next/image";

type Category = { id: string; name: string; icon: string; slug: string };
type MenuItem = {
  id: string; categoryId: string; name: string; price: number; originalPrice: number | null;
  description: string; image: string; spiceLevel: string; dietaryTags: string[];
  isAvailable: boolean; isChefSpecial: boolean; sortOrder: number;
};

const PROFILE_LEVELS = [
  "Mild",
  "Medium",
  "Hot",
  "Extra Hot",
  "Cold",
  "Hot",
  "Sweet",
  "Fresh Blended",
];

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "🌿 Vegetarian" },
  { value: "vegan", label: "🌱 Vegan" },
  { value: "fasting", label: "✝️ Fasting (Tsom)" },
  { value: "halal", label: "☪️ Halal" },
  { value: "gluten-free", label: "🌾 Gluten-Free" },
  { value: "spicy", label: "🌶️ Spicy" },
];

const emptyForm = (): Partial<MenuItem> => ({
  name: "", categoryId: "", price: 0, originalPrice: null, description: "",
  image: "", spiceLevel: "Mild", dietaryTags: [], isAvailable: true, isChefSpecial: false,
});

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>(emptyForm());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    fetch("/api/menu").then((r) => r.json()).then(setItems);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = items.filter((item) => {
    const matchCat = filterCat === "all" || item.categoryId === filterCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = (defaultCatId?: string) => {
    setEditing(null);
    setForm({ ...emptyForm(), categoryId: defaultCatId || (categories[0]?.id ?? "") });
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => { setEditing(item); setForm({ ...item }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm()); };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm((f) => ({ ...f, image: data.url }));
  };

  const handleSave = async () => {
    if (!form.name || !form.categoryId || !form.price) return;
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    await fetch("/api/menu", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...form, id: editing.id } : form),
    });
    setSaving(false);
    closeModal();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
    loadData();
  };

  const toggleAvailable = async (item: MenuItem) => {
    await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isAvailable: !item.isAvailable }),
    });
    loadData();
  };

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      dietaryTags: f.dietaryTags?.includes(tag)
        ? f.dietaryTags.filter((t) => t !== tag)
        : [...(f.dietaryTags || []), tag],
    }));
  };

  const selectedCat = categories.find((c) => c.id === form.categoryId);
  const isFormDrink = selectedCat?.slug === "drinks" || selectedCat?.name.toLowerCase().includes("drink");

  const drinksCat = categories.find((c) => c.slug === "drinks" || c.name.toLowerCase().includes("drink"));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Menu & Drinks Manager</h2>
          <p className="text-sm text-gray-500">{items.length} total items · {items.filter(i => !i.isAvailable).length} sold out</p>
        </div>
        <div className="flex gap-2">
          {drinksCat && (
            <button
              onClick={() => openAdd(drinksCat.id)}
              className="flex items-center gap-2 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-2.5 text-sm font-black text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
            >
              <Plus size={16} /> Add Drink / Juice
            </button>
          )}
          <button
            onClick={() => openAdd()}
            className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
          >
            <Plus size={16} /> Add Dish
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2">
          <Search size={14} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm text-white outline-none"
        >
          <option value="all">All Categories ({items.length})</option>
          {categories.map((c) => {
            const count = items.filter((i) => i.categoryId === c.id).length;
            return <option key={c.id} value={c.id}>{c.icon} {c.name} ({count})</option>;
          })}
        </select>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => {
          const cat = categories.find((c) => c.id === item.categoryId);
          const isDrink = cat?.slug === "drinks" || cat?.name.toLowerCase().includes("drink");

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl border bg-[#161616] transition ${
                item.isAvailable ? "border-white/10" : "border-red-500/30 opacity-70"
              }`}
            >
              {/* Image */}
              <div className="relative h-36">
                <Image src={item.image || "/images/hero.jpg"} alt={item.name} fill className="object-cover" />
                {!item.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">SOLD OUT</span>
                  </div>
                )}
                {item.isChefSpecial && (
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-yellow-400/90 px-2 py-0.5 text-[10px] font-black text-black">
                    <Star size={10} /> Special
                  </div>
                )}
                {isDrink && (
                  <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-yellow-400 backdrop-blur">
                    🥤 Drink
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-black text-white">{item.name}</h3>
                  <span className="shrink-0 text-sm font-black text-yellow-400">Br.{item.price}</span>
                </div>
                <p className="mt-1 text-[11px] text-gray-500">{cat?.icon} {cat?.name}</p>
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-gray-400">{item.description}</p>

                {/* Dietary tags & Profile */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-400">
                    {item.spiceLevel}
                  </span>
                  {item.dietaryTags.map((t) => (
                    <span key={t} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">{t}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${
                      item.isAvailable ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    {item.isAvailable ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                    {item.isAvailable ? "Available" : "Sold Out"}
                  </button>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(item)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition hover:bg-blue-500/20 hover:text-blue-400">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition hover:bg-red-500/20 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <ChefHat size={40} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">No items found in this category.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center">
          <div className="relative max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#161616] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
            <button onClick={closeModal} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white">
              <X size={18} />
            </button>

            <h3 className="mb-6 text-xl font-black">{editing ? "Edit Item" : isFormDrink ? "Add New Drink / Juice" : "Add New Item"}</h3>

            <div className="space-y-4">
              {/* Image upload */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Item Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-[#1e1e1e] transition hover:border-yellow-400/50"
                >
                  {form.image ? (
                    <Image src={form.image} alt="preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="mx-auto mb-2 text-gray-600" />
                      <p className="text-sm text-gray-500">{uploading ? "Uploading…" : "Click to upload image"}</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-600">or URL:</span>
                  <input
                    value={form.image || ""}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="/images/hero.jpg or https://..."
                    className="flex-1 rounded-lg border border-white/10 bg-[#1e1e1e] px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Name *</label>
                <input
                  value={form.name || ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={isFormDrink ? "e.g. Avocado Juice, Ethiopian Macchiato, Ambo Water" : "e.g. Wow Classic Burger, BBQ Pizza"}
                  className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Category *</label>
                <select value={form.categoryId || ""} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400">
                  <option value="">Select category…</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Price (Br.) *</label>
                  <input type="number" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} placeholder="120" className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Original Price</label>
                  <input type="number" value={form.originalPrice || ""} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value ? Number(e.target.value) : null }))} placeholder="150 (optional)" className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                <textarea rows={3} value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder={isFormDrink ? "Fresh ingredients, temperature, size, blend..." : "Ingredients, bun type, toppings, sauces..."} className="w-full resize-none rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400" />
              </div>

              {/* Profile / Spice / Temp */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Profile / Temperature</label>
                <div className="flex flex-wrap gap-2">
                  {PROFILE_LEVELS.map((s) => (
                    <button key={s} type="button" onClick={() => setForm((f) => ({ ...f, spiceLevel: s }))} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${form.spiceLevel === s ? "bg-yellow-400 text-black" : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"}`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Dietary / Nutrition Tags</label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((d) => (
                    <button key={d.value} type="button" onClick={() => toggleTag(d.value)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${form.dietaryTags?.includes(d.value) ? "bg-green-500/20 text-green-400 border border-green-500/30" : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"}`}>{d.label}</button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable ?? true} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} className="accent-yellow-400" />
                  <span className="text-sm font-bold text-gray-300">Available in Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isChefSpecial ?? false} onChange={(e) => setForm((f) => ({ ...f, isChefSpecial: e.target.checked }))} className="accent-yellow-400" />
                  <span className="text-sm font-bold text-gray-300">Chef / House Special ⭐</span>
                </label>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.categoryId || !form.price}
                className="w-full rounded-xl bg-yellow-400 py-3.5 font-black text-black transition hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
