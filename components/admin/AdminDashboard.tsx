"use client";

import { useState } from "react";
import { BarChart2, Utensils, Tags, Image as ImageIcon, Settings, LogOut, Menu, X } from "lucide-react";
import MenuManager from "./MenuManager";
import CategoryManager from "./CategoryManager";
import GalleryManager from "./GalleryManager";
import SettingsManager from "./SettingsManager";

type Tab = "dashboard" | "menu" | "categories" | "gallery" | "settings";

const tabs = [
  { id: "dashboard" as Tab, name: "Dashboard", icon: BarChart2 },
  { id: "menu" as Tab, name: "Menu & Drinks", icon: Utensils },
  { id: "categories" as Tab, name: "Categories", icon: Tags },
  { id: "gallery" as Tab, name: "Gallery", icon: ImageIcon },
  { id: "settings" as Tab, name: "Settings", icon: Settings },
];

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#121212] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h1 className="text-lg font-black text-yellow-400">Wow Burger</h1>
            <p className="text-xs text-gray-500">Admin Portal · Addis Ababa</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#121212]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white lg:hidden"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-base font-black sm:text-lg capitalize">
              {activeTab === "dashboard" ? "Dashboard" : tabs.find((t) => t.id === activeTab)?.name}
            </h2>
          </div>
          <a
            href="/"
            target="_blank"
            className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-bold text-gray-400 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            View Live Site ↗
          </a>
        </header>

        {/* Tab content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {activeTab === "dashboard" && <DashboardPanel onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === "menu" && <MenuManager />}
          {activeTab === "categories" && <CategoryManager />}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "settings" && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}

function DashboardPanel({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [stats, setStats] = useState<{
    menu: number;
    categories: number;
    drinks: number;
    available: number;
    gallery: number;
  } | null>(null);

  useState(() => {
    Promise.all([
      fetch("/api/menu").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/gallery").then((r) => r.json()),
    ]).then(([menu, cats, gallery]) => {
      const drinksCat = cats.find((c: { slug: string; name: string }) => c.slug === "drinks" || c.name.toLowerCase().includes("drink"));
      setStats({
        menu: menu.length,
        categories: cats.filter((c: { isActive: boolean }) => c.isActive).length,
        drinks: menu.filter((m: { categoryId: string }) => m.categoryId === drinksCat?.id).length,
        available: menu.filter((m: { isAvailable: boolean }) => m.isAvailable).length,
        gallery: gallery.length,
      });
    });
  });

  const cards = [
    { label: "Total Dishes & Bites", value: stats?.menu ?? "—", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Active Categories", value: stats?.categories ?? "—", color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Drinks, Juices & Shakes", value: stats?.drinks ?? "—", color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Active & In-Stock", value: stats?.available ?? "—", color: "text-green-400", bg: "bg-green-400/10" },
  ];

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border border-white/10 ${c.bg} p-5 transition`}
          >
            <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
            <p className="mt-1.5 text-xs font-bold text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
        <h3 className="mb-4 font-black text-yellow-400">Quick Shortcuts</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Manage Burgers & Dishes", tab: "menu" as Tab, desc: "Add new burgers, pizza, chicken, shawarma" },
            { label: "Manage Juices & Drinks", tab: "menu" as Tab, desc: "Add hot coffee, fresh juices, shakes, waters" },
            { label: "Categories & Groups", tab: "categories" as Tab, desc: "Organize food & drink menus with emoji icons" },
            { label: "Diner Photo Gallery", tab: "gallery" as Tab, desc: "Upload food, ambiance & drink photos" },
            { label: "Cafe & WiFi Settings", tab: "settings" as Tab, desc: "Update phone, address, WiFi pass & QR studio" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.tab)}
              className="text-left rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-yellow-400/40 hover:bg-white/10"
            >
              <p className="font-bold text-white">{a.label}</p>
              <p className="mt-1 text-xs text-gray-400">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
