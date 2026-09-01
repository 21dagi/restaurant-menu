"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Star } from "lucide-react";
import Image from "next/image";

type GalleryItem = {
  id: string; title: string; category: string; image: string; description: string; isFeatured: boolean;
};

const CATEGORIES = ["Food", "Ambiance", "Kitchen", "Drinks"];

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ title: "", category: "Food", image: "", description: "", isFeatured: false });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => fetch("/api/gallery").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: "", category: "Food", image: "", description: "", isFeatured: false }); setModalOpen(true); };
  const openEdit = (g: GalleryItem) => { setEditing(g); setForm({ title: g.title, category: g.category, image: g.image, description: g.description, isFeatured: g.isFeatured }); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditing(null); };

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
    if (!form.title || !form.image) return;
    setSaving(true);
    await fetch("/api/gallery", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    setSaving(false);
    close();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    load();
  };

  const toggleFeatured = async (item: GalleryItem) => {
    await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isFeatured: !item.isFeatured }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Gallery</h2>
          <p className="text-sm text-gray-500">{items.length} images · {items.filter((i) => i.isFeatured).length} featured</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-black text-black hover:bg-yellow-300 transition">
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161616]">
            <div className="relative h-40">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition group-hover:opacity-100" />

              {item.isFeatured && (
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-yellow-400/90 px-2 py-0.5 text-[10px] font-black text-black">
                  <Star size={10} /> Featured
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 transition group-hover:opacity-100">
                <div className="flex justify-end gap-1.5">
                  <button onClick={() => toggleFeatured(item)} className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${item.isFeatured ? "bg-yellow-400 text-black" : "bg-white/20 text-white hover:bg-yellow-400 hover:text-black"}`}>
                    <Star size={13} />
                  </button>
                  <button onClick={() => openEdit(item)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-blue-400 transition">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-red-500 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="line-clamp-1 text-xs font-bold text-white">{item.title}</p>
              <p className="text-[10px] text-gray-500">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-12 text-center text-gray-500">No gallery images yet.</div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center">
          <div className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-[#161616] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
            <button onClick={close} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="mb-6 text-xl font-black">{editing ? "Edit Image" : "Add Gallery Image"}</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Image *</label>
                <div onClick={() => fileRef.current?.click()} className="relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-[#1e1e1e] hover:border-yellow-400/50 transition">
                  {form.image ? <Image src={form.image} alt="preview" fill className="object-cover" /> : (
                    <div className="text-center">
                      <Upload size={24} className="mx-auto mb-2 text-gray-600" />
                      <p className="text-sm text-gray-500">{uploading ? "Uploading…" : "Click to upload"}</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
                <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="or paste URL…" className="mt-2 w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-3 py-2 text-xs text-white outline-none focus:border-yellow-400" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Signature Biryani" className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-white outline-none focus:border-yellow-400" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-white outline-none focus:border-yellow-400">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full resize-none rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="accent-yellow-400 scale-125" />
                <span className="font-bold text-gray-300">Featured image</span>
              </label>

              <button onClick={handleSave} disabled={saving || !form.title || !form.image} className="w-full rounded-xl bg-yellow-400 py-3.5 font-black text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add to Gallery"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
