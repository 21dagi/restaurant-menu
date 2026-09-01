"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";

type CartItem = {
  id: string; name: string; price: number; image: string;
  quantity: number; note: string; categoryId: string;
  spiceLevel: string; dietaryTags: string[]; isAvailable: boolean;
  isChefSpecial: boolean; description: string; originalPrice: number | null;
};

interface CartFloatingBarProps {
  cart: CartItem[];
  onCartChange: (cart: CartItem[]) => void;
  currencySymbol?: string;
  whatsappNumber?: string;
  tableNumber?: string | null;
}

export default function CartFloatingBar({ cart, onCartChange, currencySymbol = "Br.", whatsappNumber, tableNumber }: CartFloatingBarProps) {
  const [open, setOpen] = useState(false);

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const count = cart.reduce((sum, c) => sum + c.quantity, 0);

  const update = (id: string, qty: number) => {
    if (qty <= 0) {
      onCartChange(cart.filter((c) => c.id !== id));
    } else {
      onCartChange(cart.map((c) => c.id === id ? { ...c, quantity: qty } : c));
    }
  };

  const sendWhatsApp = () => {
    const lines = cart.map((c) => `  • ${c.name} x${c.quantity}${c.note ? ` (${c.note})` : ""} — ${currencySymbol}${c.price * c.quantity}`).join("\n");
    const tableText = tableNumber ? `📍 *Table #${tableNumber}*\n\n` : "";
    const msg = `Hello Wow Burger! I'd like to order:\n\n${tableText}${lines}\n\n*Total: ${currencySymbol}${total}*\n\nPlease confirm my order. Thank you!`;
    const num = whatsappNumber || "251911234567";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (count === 0) return null;

  return (
    <>
      {/* Floating Pill */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 lg:bottom-6 lg:left-auto lg:right-28 lg:translate-x-0"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 rounded-full bg-yellow-400 px-5 py-3 text-black shadow-2xl shadow-yellow-400/30 transition hover:bg-yellow-300"
        >
          <div className="relative">
            <ShoppingBag size={20} className="text-black" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-black text-yellow-400">
              {count}
            </span>
          </div>
          <span className="font-black text-sm">View Order · {currencySymbol}{total}</span>
        </motion.div>
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed inset-y-0 right-0 z-[120] flex w-full max-w-md flex-col bg-[#161616] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <h2 className="font-black text-white">Your Wow Burger Order</h2>
                  {tableNumber && <p className="text-xs text-yellow-400">📍 Table #{tableNumber}</p>}
                </div>
                <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-2xl border border-white/10 bg-[#1e1e1e] p-4">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <p className="font-black text-white text-sm">{item.name}</p>
                      {item.note && <p className="text-xs text-gray-500 italic">{item.note}</p>}
                      <p className="text-sm font-bold text-yellow-400">{currencySymbol}{item.price * item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => update(item.id, 0)} className="text-gray-600 hover:text-red-400 transition">
                        <Trash2 size={14} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => update(item.id, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-yellow-400 hover:text-black transition">
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-sm font-black text-white">{item.quantity}</span>
                        <button onClick={() => update(item.id, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-yellow-400 hover:text-black transition">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-gray-400 font-bold">Total</span>
                  <span className="text-2xl font-black text-yellow-400">{currencySymbol}{total}</span>
                </div>
                <button
                  onClick={sendWhatsApp}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 font-black text-white transition hover:bg-[#20bd5a]"
                >
                  <MessageCircle size={20} /> Send Order via WhatsApp
                </button>
                <p className="mt-3 text-center text-xs text-gray-600">
                  Your order with Table #{tableNumber || "?"} will be dispatched directly to Wow Burger kitchen.
                </p>
                <button
                  onClick={() => { onCartChange([]); setOpen(false); }}
                  className="mt-2 w-full text-center text-xs text-gray-600 hover:text-red-400 transition"
                >
                  Clear order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
