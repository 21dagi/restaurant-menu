"use client";

import { motion } from "framer-motion";
import { CalendarDays, Home, Image as ImageIcon, PhoneCall, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { id: "home", name: "Home", href: "#home", icon: Home },
  { id: "menu", name: "Menu", href: "#menu", icon: UtensilsCrossed },
  { id: "gallery", name: "Gallery", href: "#gallery", icon: ImageIcon },
  { id: "reservation", name: "Reserve", href: "#reservation", icon: CalendarDays },
  { id: "contact", name: "Contact", href: "#contact", icon: PhoneCall },
];

export default function MobileBottomNav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          return;
        }
      }
      setActiveSection("home");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[92vw] lg:hidden">
      <nav
        aria-label="Mobile Bottom Navigation"
        className="flex items-center gap-1 rounded-full border border-yellow-400/30 bg-[#121212]/90 px-2.5 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:gap-2 sm:px-4 sm:py-2"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center justify-center rounded-full px-2.5 py-1.5 text-center transition-all duration-300 sm:px-3 sm:py-2 ${
                isActive ? "text-black font-extrabold" : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-bottom-nav-active"
                  className="absolute inset-0 rounded-full bg-yellow-400 shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              <span className="relative z-10 flex flex-col items-center">
                <Icon size={18} className="sm:size-5" />
                <span className="mt-0.5 text-[10px] sm:text-xs font-bold leading-none">
                  {item.name}
                </span>
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
