"use client";

import { motion } from "framer-motion";
import { Award, Flame, Leaf } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Flame,
      title: "Fresh-Pressed",
      description: "Hand-pressed patties smashed to order — always juicy, never frozen.",
    },
    {
      icon: Leaf,
      title: "Local Ingredients",
      description: "Fresh bakery buns and market produce sourced daily in Addis.",
    },
    {
      icon: Award,
      title: "Voted #1 Burger",
      description: "Addis Ababa's top-rated casual diner for friends and families.",
    },
  ];

  return (
    <section id="about" className="bg-[#f7f0df] px-4 py-14 sm:px-6 sm:py-20 text-[#20170f]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Responsive Compact Story Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative h-60 w-full overflow-hidden rounded-3xl sm:h-80 md:h-96 lg:h-[440px]"
          style={{
            backgroundImage: "url('/images/about.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Badge */}
          <div className="absolute bottom-4 left-4 rounded-2xl bg-yellow-400/95 px-4 py-2.5 text-black shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:px-5 sm:py-3">
            <p className="text-xl font-black sm:text-2xl">7+ Years</p>
            <p className="text-[11px] font-bold text-black/80 sm:text-xs">Serving Addis Ababa</p>
          </div>
        </motion.div>

        {/* Story Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a67c00] sm:text-sm">
            Our Story
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl">
            Born in Bole. Built for Burger Lovers.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#6b5a48] sm:mt-4 sm:text-base sm:leading-7">
            Crafting Addis Ababa&apos;s crispiest smash burgers, wood-fired pizzas,
            and signature layered Ethiopian juices. Made fresh to order with love.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-2xl border border-[#d8c9aa] bg-white p-3.5 sm:flex-col sm:items-start sm:p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#20170f] text-yellow-400">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black sm:text-sm">{feature.title}</h3>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#6b5a48] sm:mt-1 sm:text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}