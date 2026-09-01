"use client";

import { useEffect, useState } from "react";
import { Save, QrCode, Download, Wifi, Phone, MapPin, Clock, RefreshCw } from "lucide-react";

type Settings = {
  restaurantName: string; tagLine: string; currencySymbol: string; currencyCode: string;
  phone: string; whatsappNumber: string; email: string; address: string; mapUrl: string;
  openingHours: string; openingDays: string; wifiSSID: string; wifiPassword: string;
  tableCount: number; adminPin?: string;
};

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Partial<Settings & { adminPin: string }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tableNum, setTableNum] = useState(1);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Load settings including adminPin for admin use
    fetch("/api/settings").then((r) => r.json()).then((data) => {
      setSettings(data);
      setForm({ ...data, adminPin: "" });
    });
  }, []);

  const generateQr = () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/?table=${tableNum}`;
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&margin=10`;
    setQrUrl(qr);
  };

  const downloadQr = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `table-${tableNum}-qr.png`;
    link.click();
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: Partial<Settings & { adminPin: string }> = { ...form };
    if (!payload.adminPin) delete payload.adminPin;
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ label, field, type = "text", placeholder }: { label: string; field: keyof typeof form; type?: string; placeholder?: string }) => (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
      <input
        type={type}
        value={(form[field] as string) ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
      />
    </div>
  );

  if (!settings) {
    return <div className="flex items-center justify-center py-20"><RefreshCw className="animate-spin text-yellow-400" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Restaurant Info */}
      <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
        <h3 className="mb-5 flex items-center gap-2 font-black text-yellow-400"><MapPin size={18} /> Restaurant Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Restaurant Name" field="restaurantName" placeholder="Wow Burger" />
          <Field label="Tagline" field="tagLine" placeholder="Addis Ababa's Favourite Burger Joint" />
          <div className="sm:col-span-2"><Field label="Address" field="address" placeholder="Bole Road, Addis Ababa, Ethiopia" /></div>
          <Field label="Map URL" field="mapUrl" placeholder="https://maps.google.com/..." />
          <Field label="Email" field="email" placeholder="order@wowburger.et" />
        </div>
      </div>

      {/* Contact & Hours */}
      <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
        <h3 className="mb-5 flex items-center gap-2 font-black text-yellow-400"><Phone size={18} /> Contact & Opening Hours</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone Number" field="phone" placeholder="+251 91 123 4567" />
          <Field label="WhatsApp Number (digits only)" field="whatsappNumber" placeholder="251911234567" />
          <Field label="Opening Hours" field="openingHours" placeholder="10:00 AM – 12:00 AM" />
          <Field label="Opening Days" field="openingDays" placeholder="Monday – Sunday" />
        </div>
      </div>

      {/* Currency */}
      <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
        <h3 className="mb-5 font-black text-yellow-400">Currency Settings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Currency Symbol" field="currencySymbol" placeholder="Br." />
          <Field label="Currency Code" field="currencyCode" placeholder="ETB" />
        </div>
      </div>

      {/* WiFi */}
      <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
        <h3 className="mb-5 flex items-center gap-2 font-black text-yellow-400"><Wifi size={18} /> WiFi Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WiFi Network Name (SSID)" field="wifiSSID" placeholder="WowBurger_Free" />
          <Field label="WiFi Password" field="wifiPassword" placeholder="wowburger2026" />
        </div>
        <p className="mt-3 text-xs text-gray-600">Customers can tap the WiFi icon at their table to copy the password instantly.</p>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
        <h3 className="mb-5 font-black text-yellow-400">Admin Security</h3>
        <div className="max-w-xs">
          <Field label="Change Admin PIN (leave blank to keep current)" field="adminPin" type="password" placeholder="New PIN (min 4 digits)" />
        </div>
        <p className="mt-2 text-xs text-gray-600">Default PIN: 1234. After changing, you will need to re-login.</p>
      </div>

      {/* Table Count */}
      <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
        <h3 className="mb-5 flex items-center gap-2 font-black text-yellow-400"><Clock size={18} /> Table Configuration</h3>
        <div className="max-w-xs">
          <Field label="Number of Tables" field="tableCount" type="number" placeholder="20" />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 rounded-xl px-7 py-4 font-black transition ${saved ? "bg-green-500 text-white" : "bg-yellow-400 text-black hover:bg-yellow-300"} disabled:opacity-60`}
      >
        <Save size={18} />
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save All Settings"}
      </button>

      {/* QR Code Studio */}
      <div className="rounded-2xl border border-yellow-400/20 bg-[#161616] p-6">
        <h3 className="mb-2 flex items-center gap-2 font-black text-yellow-400"><QrCode size={18} /> Table QR Code Studio</h3>
        <p className="mb-5 text-sm text-gray-500">Generate branded QR codes for each table. Customers scan to open the menu with their table pre-selected.</p>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Table Number</label>
            <input
              type="number"
              min={1}
              max={50}
              value={tableNum}
              onChange={(e) => setTableNum(Number(e.target.value))}
              className="w-28 rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>
          <button onClick={generateQr} className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 transition">
            <QrCode size={16} /> Generate QR
          </button>
        </div>

        {qrUrl && (
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt={`Table ${tableNum} QR`} className="h-48 w-48 rounded-2xl border border-white/10 bg-white p-2" />
            <div>
              <p className="font-black text-white">Table #{tableNum}</p>
              <p className="mt-1 break-all text-xs text-gray-500">{window.location.origin}/?table={tableNum}</p>
              <button onClick={downloadQr} className="mt-4 flex items-center gap-2 rounded-xl border border-yellow-400/30 px-5 py-2.5 text-sm font-bold text-yellow-400 hover:bg-yellow-400/10 transition">
                <Download size={15} /> Download QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
