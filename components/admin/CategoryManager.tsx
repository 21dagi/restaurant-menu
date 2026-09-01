"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";

type Category = {
  id: string; name: string; slug: string; icon: string; order: number; isActive: boolean;
};

const ICON_PRESETS = ["🍚", "🍛", "🥗", "🥤", "🍮", "🫓", "🍲", "🥩", "🍝", "🍜", "🥘", "🍱", "☕", "🍰", "🥪", "🫔", "🌮", "🍕"];

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "🍽️", isActive: true });
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/categories").then((r) => r.json()).then((data) => setCategories([...data].sort((a: Category, b: Category) => a.order - b.order)));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", icon: "🍽️", isActive: true }); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, icon: c.icon, isActive: c.isActive }); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    await fetch("/api/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    setSaving(false);
    close();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? All menu items in this category will still exist but won't be categorized.")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    load();
  };

  const toggleActive = async (cat: Category) => {
    await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, isActive: !cat.isActive }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Menu Categories</h2>
          <p className="text-sm text-gray-500">{categories.length} categories · {categories.filter((c) => c.isActive).length} active</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-black text-black hover:bg-yellow-300 transition">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className={`flex items-center gap-4 rounded-2xl border p-4 transition ${cat.isActive ? "border-white/10 bg-[#161616]" : "border-white/5 bg-white/2 opacity-50"}`}>
            <GripVertical size={18} className="shrink-0 text-gray-700 cursor-grab" />
            <span className="text-2xl">{cat.icon}</span>
            <div className="flex-1">
              <p className="font-black text-white">{cat.name}</p>
              <p className="text-xs text-gray-500">slug: {cat.slug}</p>
            </div>
            <button
              onClick={() => toggleActive(cat)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${cat.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-500"}`}
            >
              {cat.isActive ? "Active" : "Hidden"}
            </button>
            <button onClick={() => openEdit(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400 transition">
              <Pencil size={14} />
            </button>
            <button onClick={() => handleDelete(cat.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="mt-12 text-center text-gray-500">No categories yet. Create your first one!</div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center">
          <div className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-[#161616] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
            <button onClick={close} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="mb-6 text-xl font-black">{editing ? "Edit Category" : "Add Category"}</h3>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Category Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Main Course" className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-white outline-none focus:border-yellow-400" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Icon Emoji</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {ICON_PRESETS.map((icon) => (
                    <button key={icon} type="button" onClick={() => setForm((f) => ({ ...f, icon }))} className={`rounded-lg p-2 text-xl transition ${form.icon === icon ? "bg-yellow-400" : "bg-white/5 hover:bg-white/10"}`}>{icon}</button>
                  ))}
                </div>
                <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} maxLength={2} placeholder="Or type emoji…" className="w-28 rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-2 text-center text-2xl text-white outline-none focus:border-yellow-400" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-yellow-400 scale-125" />
                <span className="font-bold text-gray-300">Show this category to customers</span>
              </label>

              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="w-full rounded-xl bg-yellow-400 py-3.5 font-black text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
