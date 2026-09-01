"use client";

import { useEffect, useState } from "react";

type Settings = {
  restaurantName: string; address: string; phone: string; email: string; openingHours: string;
};

export default function Footer() {
  const [s, setS] = useState<Settings>({
    restaurantName: "Wow Burger",
    address: "Bole Road, Addis Ababa, Ethiopia",
    phone: "+251 91 123 4567",
    email: "order@wowburger.et",
    openingHours: "10:00 AM – 12:00 AM",
  });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data: Settings) => setS(data)).catch(() => {});
  }, []);

  return (
    <footer className="border-t border-white/10 bg-black px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-black text-yellow-400">{s.restaurantName}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Authentic cuisine with premium hospitality, delicious flavors, and an unforgettable dining experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
            <div className="flex flex-col gap-3 text-gray-300">
              <a href="#about" className="hover:text-yellow-400 transition">About</a>
              <a href="#menu" className="hover:text-yellow-400 transition">Menu</a>
              <a href="#gallery" className="hover:text-yellow-400 transition">Gallery</a>
              <a href="#reservation" className="hover:text-yellow-400 transition">Reservation</a>
              <a href="#contact" className="hover:text-yellow-400 transition">Contact</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>📍 {s.address}</p>
              <p>📞 {s.phone}</p>
              <p>📧 {s.email}</p>
              <p>🕒 {s.openingHours}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {s.restaurantName}. All Rights Reserved.
          {" · "}
          <a href="/admin" className="hover:text-yellow-400 transition">Staff Portal</a>
        </div>
      </div>
    </footer>
  );
}