import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/251911234567?text=Hello%20Wow%20Burger!%20I%20would%20like%20to%20order%20or%20book%20a%20table."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-110"
      aria-label="Chat on WhatsApp (+251 91 123 4567)"
    >
      <MessageCircle size={28} />
    </a>
  );
}