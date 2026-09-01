"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type GalleryItem = {
  id: string | number;
  image: string;
  title: string;
  category: string;
  description: string;
};

const FALLBACK_ITEMS: GalleryItem[] = [
  { id: 1, image: "/images/hero.jpg", title: "Wow Classic Smash Burger", category: "Food", description: "Hand-pressed double patty with melted cheddar, caramelised onion and Wow secret sauce." },
  { id: 2, image: "/images/gallery2.jpg", title: "Addis Diner Ambiance", category: "Ambiance", description: "Vibrant and cozy seating area perfect for friends, family, and casual catch-ups." },
  { id: 3, image: "/images/gallery3.jpg", title: "Fresh Sizzle in the Kitchen", category: "Kitchen", description: "Hot smash grill and wood-fire ovens in action every single minute." },
  { id: 4, image: "/images/gallery4.jpg", title: "BBQ Chicken Pizza", category: "Food", description: "Freshly baked pizza loaded with grilled chicken, mozzarella and smoky BBQ drizzle." },
  { id: 5, image: "/images/gallery1.jpg", title: "Ethiopian Layered Juices & Shakes", category: "Drinks", description: "Fresh avocado, mango, papaya and rich milkshakes blended to perfection." },
  { id: 6, image: "/images/about.jpg", title: "Shawarma & Wraps", category: "Food", description: "Spiced chicken and beef shawarmas rolled with garlic tahini in warm flatbread." },
];

const GALLERY_CATEGORIES = ["All", "Food", "Ambiance", "Kitchen", "Drinks"] as const;

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [apiItems, setApiItems] = useState<GalleryItem[]>(FALLBACK_ITEMS);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data: GalleryItem[]) => {
        if (Array.isArray(data) && data.length > 0) setApiItems(data);
      })
      .catch(() => {});
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return apiItems;
    return apiItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, apiItems]);

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return current === 0 ? filteredItems.length - 1 : current - 1;
    });
  };

  const showNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return current === filteredItems.length - 1 ? 0 : current + 1;
    });
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Escape") setSelectedIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  return (
    <>
      <section id="gallery" className="bg-[#f7f0df] px-4 py-16 sm:px-6 sm:py-24 text-[#20170f]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.3em] text-[#a67c00]">
              Gallery
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
              A Glimpse of Wow Burger
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#6b5a48] sm:text-base">
              Explore our juicy smash burgers, wood-fired pizzas, crispy chicken, and fresh Ethiopian juices & shakes.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              {GALLERY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedIndex(null);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition sm:px-5 sm:py-2.5 sm:text-sm ${
                    activeCategory === category
                      ? "bg-[#20170f] text-yellow-400 shadow-md"
                      : "border border-[#d8c9aa] bg-white text-[#6b5a48] hover:border-[#20170f] hover:text-[#20170f]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Gallery Grid: 2-column mobile, 3-column desktop */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => setSelectedIndex(index)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#d8c9aa] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
              >
                <div className="relative h-40 w-full sm:h-64 md:h-72">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition duration-300 group-hover:opacity-90" />

                  {/* Category Badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-yellow-400 backdrop-blur-md">
                    {item.category}
                  </span>

                  {/* Title & Description Overlay on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-white">
                    <h3 className="line-clamp-1 text-sm font-black sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-300 opacity-80 sm:line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Expand icon pill */}
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition group-hover:bg-yellow-400 group-hover:text-black sm:h-9 sm:w-9">
                    <Expand size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-12 text-center text-gray-500">
              No gallery images found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && filteredItems[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-3 backdrop-blur-md sm:p-6"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-yellow-400 hover:text-black"
            >
              <X size={24} />
            </button>

            {/* Left Nav Button */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-yellow-400 hover:text-black sm:left-6"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Right Nav Button */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-yellow-400 hover:text-black sm:right-6"
            >
              <ChevronRight size={28} />
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              key={filteredItems[selectedIndex].id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#161616]"
            >
              <div className="relative h-[55vh] w-full sm:h-[65vh]">
                <Image
                  src={filteredItems[selectedIndex].image}
                  alt={filteredItems[selectedIndex].title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="border-t border-white/10 bg-[#1e1e1e] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                      {filteredItems[selectedIndex].category}
                    </span>
                    <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                      {filteredItems[selectedIndex].title}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 sm:text-sm">
                    {selectedIndex + 1} / {filteredItems.length}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {filteredItems[selectedIndex].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}