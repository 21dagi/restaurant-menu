"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Bell, Receipt, Wifi, Copy, Check } from "lucide-react";

interface TableContextBarProps {
  wifiSSID?: string;
  wifiPassword?: string;
  whatsappNumber?: string;
}

function TableBarInner({ wifiSSID, wifiPassword, whatsappNumber }: TableContextBarProps) {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");
  const [copied, setCopied] = useState(false);
  const [wifiOpen, setWifiOpen] = useState(false);

  if (!tableNumber) return null;

  const copyWifi = () => {
    navigator.clipboard.writeText(wifiPassword || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const callWaiter = () => {
    const msg = `Hello! Table #${tableNumber} needs assistance. Could you please send a waiter? Thank you!`;
    const num = whatsappNumber || "251911234567";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const requestBill = () => {
    const msg = `Hello! We are ready for the bill at Table #${tableNumber}. Thank you!`;
    const num = whatsappNumber || "251911234567";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <div className="sticky top-[56px] z-40 border-b border-yellow-400/20 bg-[#1a1200]/95 backdrop-blur-xl lg:top-[64px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-black">
              {tableNumber}
            </div>
            <span className="text-sm font-bold text-yellow-400">Table #{tableNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWifiOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              <Wifi size={13} /> WiFi
            </button>
            <button
              onClick={callWaiter}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              <Bell size={13} /> Waiter
            </button>
            <button
              onClick={requestBill}
              className="flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 text-xs font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
            >
              <Receipt size={13} /> Bill
            </button>
          </div>
        </div>
      </div>

      {/* WiFi Modal */}
      {wifiOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center" onClick={() => setWifiOpen(false)}>
          <div className="w-full max-w-sm rounded-t-3xl border border-white/10 bg-[#1a1a1a] p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">
              <Wifi size={28} className="text-blue-400" />
            </div>
            <h3 className="text-center text-xl font-black text-white">Guest WiFi</h3>
            <div className="mt-5 space-y-3 rounded-2xl bg-white/5 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Network</span>
                <span className="font-bold text-white">{wifiSSID || "WowBurger_Free"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Password</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{wifiPassword || "—"}</span>
                  <button onClick={copyWifi} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-gray-400 hover:bg-yellow-400 hover:text-black transition">
                    {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => setWifiOpen(false)} className="mt-4 w-full rounded-xl bg-yellow-400 py-3 font-black text-black hover:bg-yellow-300 transition">
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function TableContextBar(props: TableContextBarProps) {
  return (
    <Suspense fallback={null}>
      <TableBarInner {...props} />
    </Suspense>
  );
}
