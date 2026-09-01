"use client";

import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  const [phone, setPhone] = useState("+251 91 123 4567");
  const [whatsapp, setWhatsapp] = useState("251911234567");

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.phone) setPhone(data.phone);
        if (data.whatsappNumber) setWhatsapp(data.whatsappNumber);
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      {/* Back to Top */}
      {showTop && (
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-yellow-400 hover:text-black sm:h-12 sm:w-12"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Call Button (Ethiopian Demo: +251 91 123 4567) */}
      <a
        href={`tel:${cleanPhone}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-black shadow-2xl transition duration-300 hover:scale-110 hover:bg-yellow-300 sm:h-14 sm:w-14"
        aria-label={`Call Wow Burger Ethiopia (${phone})`}
        title={`Call Wow Burger: ${phone}`}
      >
        <Phone size={22} className="sm:size-6" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Wow Burger! I would like to place an order or ask a question.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition duration-300 hover:scale-110 hover:bg-[#20bd5a] sm:h-14 sm:w-14"
        aria-label={`Chat on WhatsApp (${phone})`}
        title={`WhatsApp: ${phone}`}
      >
        <MessageCircle size={24} className="sm:size-7" />
      </a>
    </div>
  );
}