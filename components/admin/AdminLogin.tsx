"use client";

import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid PIN");
      } else {
        onLogin();
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-3xl border border-white/10 bg-[#161616] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 shadow-lg shadow-yellow-400/30">
              <Lock size={28} className="text-black" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Portal</h1>
            <p className="mt-1 text-sm text-gray-500">Wow Burger Restaurant Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">
                Admin PIN
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your PIN"
                  maxLength={8}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e] px-5 py-4 pr-12 text-lg font-bold text-white tracking-widest outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className="w-full rounded-2xl bg-yellow-400 py-4 font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Enter Portal"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Default PIN: <span className="font-bold text-gray-400">1234</span> · Change in Settings
          </p>
        </div>
      </motion.div>
    </div>
  );
}
