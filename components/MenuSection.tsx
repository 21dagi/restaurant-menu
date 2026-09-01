"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Star, ShoppingBag, Coffee, Flame, Droplets, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Category = { id: string; name: string; icon: string; slug: string; isActive: boolean };
type Dish = {
  id: string; categoryId: string; name: string; price: number; originalPrice: number | null;
  description: string; image: string; spiceLevel: string; dietaryTags: string[];
  isAvailable: boolean; isChefSpecial: boolean;
};

type CartItem = Dish & { quantity: number; note: string };

const DIETARY_FILTER_OPTIONS = [
  { value: "vegetarian", label: "🌿 Veg" },
  { value: "vegan", label: "🌱 Vegan" },
  { value: "fasting", label: "✝️ Fasting (Tsom)" },
  { value: "halal", label: "☪️ Halal" },
  { value: "gluten-free", label: "🌾 GF" },
];

const DRINK_TYPE_FILTERS = [
  { value: "all", label: "🥤 All Drinks" },
  { value: "juice", label: "🍹 Fresh Juices & Spris" },
  { value: "hot", label: "☕ Hot Coffee & Tea" },
  { value: "shake", label: "🍨 Shakes & Smoothies" },
  { value: "cold", label: "🧊 Cold & Sodas" },
  { value: "water", label: "💧 Water & Mineral" },
];

const ITEMS_PER_PAGE = 8;

interface MenuSectionProps {
  onCartChange?: (cart: CartItem[]) => void;
  currencySymbol?: string;
  whatsappNumber?: string;
  tableNumber?: string | null;
}

export default function MenuSection({ onCartChange, currencySymbol = "Br.", whatsappNumber, tableNumber }: MenuSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [drinkSubFilter, setDrinkSubFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dishNote, setDishNote] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const menuGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/menu").then((r) => r.json()),
    ]).then(([cats, menu]) => {
      setCategories(cats.filter((c: Category) => c.isActive));
      setDishes(menu);
      setLoading(false);
    });
  }, []);

  // Reset pagination on filter or category change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, drinkSubFilter, search, dietaryFilter]);

  const drinksCategory = categories.find((c) => c.slug === "drinks" || c.name.toLowerCase().includes("drink"));
  const isDrinksActive = activeCategory === drinksCategory?.id;

  const filtered = useMemo(() => {
    return dishes.filter((dish) => {
      const matchCat = activeCategory === "all" || dish.categoryId === activeCategory;
      const matchSearch = `${dish.name} ${dish.description}`.toLowerCase().includes(search.toLowerCase());
      const matchDiet = dietaryFilter.length === 0 || dietaryFilter.every((f) => dish.dietaryTags.includes(f));

      // Drink sub-filters
      let matchDrinkType = true;
      if (isDrinksActive && drinkSubFilter !== "all") {
        const text = `${dish.name} ${dish.description} ${dish.spiceLevel}`.toLowerCase();
        if (drinkSubFilter === "juice") {
          matchDrinkType = text.includes("juice") || text.includes("spris") || text.includes("mango") || text.includes("avocado") || text.includes("papaya") || text.includes("lemon");
        } else if (drinkSubFilter === "hot") {
          matchDrinkType = dish.spiceLevel === "Hot" || text.includes("coffee") || text.includes("macchiato") || text.includes("tea") || text.includes("hot chocolate");
        } else if (drinkSubFilter === "shake") {
          matchDrinkType = text.includes("shake") || text.includes("milkshake") || text.includes("smoothie");
        } else if (drinkSubFilter === "cold") {
          matchDrinkType = text.includes("cola") || text.includes("fanta") || text.includes("sprite") || text.includes("soft drink") || text.includes("cooler") || text.includes("iced");
        } else if (drinkSubFilter === "water") {
          matchDrinkType = text.includes("water") || text.includes("ambo") || text.includes("sparkling") || text.includes("mineral");
        }
      }

      return matchCat && matchSearch && matchDiet && matchDrinkType;
    });
  }, [dishes, activeCategory, search, dietaryFilter, isDrinksActive, drinkSubFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      menuGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleDietaryFilter = (val: string) => {
    setDietaryFilter((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);
  };

  const addToCart = useCallback((dish: Dish) => {
    const newCart = [...cart];
    const existing = newCart.find((c) => c.id === dish.id);
    if (existing) {
      existing.quantity += addQty;
    } else {
      newCart.push({ ...dish, quantity: addQty, note: dishNote });
    }
    setCart(newCart);
    onCartChange?.(newCart);
    setSelectedDish(null);
    setDishNote("");
    setAddQty(1);
  }, [cart, addQty, dishNote, onCartChange]);

  const getCatName = (id: string) => categories.find((c) => c.id === id);

  const renderBadge = (dish: Dish) => {
    const cat = getCatName(dish.categoryId);
    const isDrink = cat?.slug === "drinks" || cat?.name.toLowerCase().includes("drink");
    if (isDrink) {
      if (dish.spiceLevel === "Hot") {
        return <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400"><Coffee size={11} /> Hot</span>;
      }
      if (dish.spiceLevel === "Cold") {
        return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400"><Droplets size={11} /> Chilled</span>;
      }
      return <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-400"><Sparkles size={11} /> Fresh</span>;
    }
    return <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400"><Flame size={11} className={dish.spiceLevel === "Hot" ? "text-red-400" : "text-gray-500"} /> {dish.spiceLevel}</span>;
  };

  if (loading) {
    return (
      <section id="menu" className="bg-[#111111] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-[#1b1b1b] h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="menu" ref={menuGridRef} className="scroll-mt-20 bg-[#111111] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.3em] text-yellow-400">Our Fresh Menu</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl md:text-5xl">Burgers, Bites & Drinks</h2>
            <p className="mx-auto mt-2.5 max-w-2xl text-xs text-gray-400 sm:text-sm">
              Hand-pressed smash burgers, wood-fired pizzas, crispy wings and fresh Ethiopian juices.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mt-6 max-w-xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1b1b1b] px-4 py-3">
              <Search size={16} className="text-yellow-400 shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search burgers, pizzas, juices, shakes…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
              />
              {search && <button onClick={() => setSearch("")}><X size={15} className="text-gray-500 hover:text-white" /></button>}
            </div>
          </div>

          {/* Dietary Filters */}
          <div className="mt-3.5 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {DIETARY_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleDietaryFilter(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  dietaryFilter.includes(opt.value)
                    ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                    : "border border-white/10 bg-[#1b1b1b] text-gray-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => { setActiveCategory("all"); setDrinkSubFilter("all"); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition sm:px-4 sm:py-2 sm:text-sm ${activeCategory === "all" ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : "border border-white/10 bg-[#1b1b1b] text-gray-300 hover:border-yellow-400 hover:text-yellow-400"}`}
            >
              🍽️ All ({dishes.length})
            </button>
            {categories.map((cat) => {
              const count = dishes.filter((d) => d.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setDrinkSubFilter("all"); }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition sm:px-4 sm:py-2 sm:text-sm ${activeCategory === cat.id ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : "border border-white/10 bg-[#1b1b1b] text-gray-300 hover:border-yellow-400 hover:text-yellow-400"}`}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Drinks Sub-filter bar if Drinks category is active */}
          {isDrinksActive && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3.5 flex flex-wrap justify-center gap-1.5 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-2"
            >
              {DRINK_TYPE_FILTERS.map((df) => (
                <button
                  key={df.value}
                  onClick={() => setDrinkSubFilter(df.value)}
                  className={`rounded-xl px-3 py-1 text-xs font-black transition ${
                    drinkSubFilter === df.value
                      ? "bg-yellow-400 text-black"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Items Summary & Page Info */}
          <div className="mt-6 flex items-center justify-between px-1 text-xs text-gray-400">
            <p>
              Showing <span className="font-bold text-yellow-400">{filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-bold text-white">{filtered.length}</span> items
            </p>
            {totalPages > 1 && (
              <p>Page <span className="font-bold text-yellow-400">{currentPage}</span> of {totalPages}</p>
            )}
          </div>

          {/* Grid Container with Controlled Scroll Viewport */}
          <div className="mt-4 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {paginatedItems.map((dish, index) => {
                const cat = getCatName(dish.categoryId);
                return (
                  <motion.article
                    key={dish.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`group flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#1b1b1b] shadow-xl transition duration-300 hover:-translate-y-1 sm:rounded-3xl ${
                      dish.isAvailable ? "border-white/10 hover:border-yellow-400/50" : "border-white/5 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="relative h-32 overflow-hidden sm:h-44 md:h-48">
                        <Image src={dish.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"} alt={dish.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                        {!dish.isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                            <span className="rounded-full bg-red-500 px-3 py-1 text-[11px] font-black text-white">Sold Out</span>
                          </div>
                        )}
                        <div className="absolute left-2.5 top-2.5 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold text-yellow-400 backdrop-blur sm:px-3 sm:py-1.5 sm:text-xs">
                          {cat?.icon} {cat?.name}
                        </div>
                        {dish.isChefSpecial && (
                          <div className="absolute right-2 top-2 rounded-full bg-yellow-400/90 px-2 py-0.5 flex items-center gap-1 text-[9px] font-black text-black">
                            <Star size={9} />Special
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="flex items-baseline justify-between gap-1.5">
                          <h3 className="line-clamp-1 text-sm font-black text-white sm:text-base">{dish.name}</h3>
                          <div className="shrink-0 text-right">
                            <span className="text-xs font-black text-yellow-400 sm:text-sm">{currencySymbol}{dish.price}</span>
                            {dish.originalPrice && <span className="ml-1 text-[10px] text-gray-500 line-through">{currencySymbol}{dish.originalPrice}</span>}
                          </div>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-gray-400 sm:text-xs">{dish.description}</p>
                        {dish.dietaryTags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {dish.dietaryTags.slice(0, 3).map((t) => (
                              <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                      <div className="flex items-center justify-between gap-1.5 border-t border-white/5 pt-2">
                        {renderBadge(dish)}
                        <button
                          type="button"
                          disabled={!dish.isAvailable}
                          onClick={() => { setSelectedDish(dish); setAddQty(1); setDishNote(""); }}
                          className="rounded-lg bg-yellow-400 px-2.5 py-1 text-[11px] font-black text-black transition hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed sm:rounded-xl sm:px-3.5 sm:py-1.5 sm:text-xs"
                        >
                          {dish.isAvailable ? "Add / View" : "Sold Out"}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 items-center gap-1 rounded-xl border border-white/10 bg-[#1b1b1b] px-3.5 text-xs font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-white"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-10 w-10 rounded-xl text-xs font-black transition ${
                      currentPage === pageNum
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                        : "border border-white/10 bg-[#1b1b1b] text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 items-center gap-1 rounded-xl border border-white/10 bg-[#1b1b1b] px-3.5 text-xs font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-white"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {filtered.length === 0 && !loading && (
            <div className="mt-12 rounded-3xl border-2 border-dashed border-white/10 bg-[#1b1b1b] p-12 text-center">
              <p className="text-xl font-black text-yellow-400">No items found</p>
              <p className="mt-2 text-gray-500">Try selecting a different category or adjusting your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/85 px-0 pb-0 backdrop-blur-sm sm:items-center sm:px-5 sm:pb-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl border border-yellow-400/20 bg-[#171717] sm:rounded-[2rem]"
            >
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-yellow-400 hover:text-black transition"
              >
                <X size={20} />
              </button>

              <div className="grid sm:grid-cols-2">
                <div className="relative min-h-[220px] sm:min-h-[360px]">
                  <Image src={selectedDish.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"} alt={selectedDish.name} fill className="object-cover" />
                  {selectedDish.isChefSpecial && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">
                      <Star size={12} /> Chef&apos;s Special
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                    {getCatName(selectedDish.categoryId)?.icon} {getCatName(selectedDish.categoryId)?.name}
                  </span>
                  <h3 className="mt-4 text-2xl font-black text-white">{selectedDish.name}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-2xl font-black text-yellow-400">{currencySymbol}{selectedDish.price}</p>
                    {selectedDish.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">{currencySymbol}{selectedDish.originalPrice}</p>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-gray-300">{selectedDish.description}</p>

                  {selectedDish.dietaryTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedDish.dietaryTags.map((t) => (
                        <span key={t} className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-400">{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 rounded-xl bg-white/5 px-4 py-3">
                    <p className="text-xs text-gray-500">Profile / Temperature</p>
                    <p className="mt-1 font-bold text-white">{selectedDish.spiceLevel}</p>
                  </div>

                  {/* Special request note */}
                  <textarea
                    rows={2}
                    value={dishNote}
                    onChange={(e) => setDishNote(e.target.value)}
                    placeholder="Special request? (e.g. extra cheese, no ice, extra sauce…)"
                    className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-[#1e1e1e] px-3 py-2.5 text-xs text-white outline-none focus:border-yellow-400 placeholder:text-gray-600"
                  />

                  {/* Quantity */}
                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => setAddQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-yellow-400 hover:text-black transition font-black text-lg">−</button>
                    <span className="w-8 text-center font-black text-white">{addQty}</span>
                    <button onClick={() => setAddQty((q) => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-yellow-400 hover:text-black transition font-black text-lg">+</button>
                    <span className="ml-2 text-sm text-gray-400">{currencySymbol}{selectedDish.price * addQty}</span>
                  </div>

                  <button
                    onClick={() => addToCart(selectedDish)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 font-black text-black transition hover:bg-yellow-300"
                  >
                    <ShoppingBag size={18} /> Add to Order · {currencySymbol}{selectedDish.price * addQty}
                  </button>

                  <a
                    href="#reservation"
                    onClick={() => setSelectedDish(null)}
                    className="mt-3 block text-center text-sm text-gray-500 hover:text-yellow-400 transition"
                  >
                    Reserve a Table →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}