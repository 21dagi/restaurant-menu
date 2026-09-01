"use client";

import About from "@/components/About";
import CartFloatingBar from "@/components/CartFloatingBar";
import Contact from "@/components/Contact";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navbar from "@/components/Navbar";
import Reservation from "@/components/Reservation";
import TableContextBar from "@/components/TableContextBar";
import Testimonials from "@/components/Testimonials";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type CartItem = {
  id: string; name: string; price: number; image: string;
  quantity: number; note: string; categoryId: string;
  spiceLevel: string; dietaryTags: string[]; isAvailable: boolean;
  isChefSpecial: boolean; description: string; originalPrice: number | null;
};

type Settings = {
  currencySymbol: string; whatsappNumber: string; wifiSSID: string; wifiPassword: string;
};

function PageContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<Settings>({
    currencySymbol: "Br.", whatsappNumber: "251911234567", wifiSSID: "WowBurger_Free", wifiPassword: ""
  });
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Settings) => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <main className="overflow-x-hidden bg-[#111111] pb-16 text-white lg:pb-0">
      <Navbar />
      <TableContextBar
        wifiSSID={settings.wifiSSID}
        wifiPassword={settings.wifiPassword}
        whatsappNumber={settings.whatsappNumber}
      />
      <Hero />
      <About />
      <MenuSection
        onCartChange={setCart}
        currencySymbol={settings.currencySymbol}
        whatsappNumber={settings.whatsappNumber}
        tableNumber={tableNumber}
      />
      <Gallery />
      <Testimonials />
      <Reservation />
      <Contact />
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
      <CartFloatingBar
        cart={cart}
        onCartChange={setCart}
        currencySymbol={settings.currencySymbol}
        whatsappNumber={settings.whatsappNumber}
        tableNumber={tableNumber}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111111]" />}>
      <PageContent />
    </Suspense>
  );
}