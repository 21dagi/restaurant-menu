"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-20 pt-44 md:pt-40"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />

      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">


        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-5xl text-6xl font-black leading-[1.0] text-white sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Wow
          <span className="block text-yellow-400">Burger</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-8 text-gray-200 sm:text-lg md:text-xl"
        >
          Smash burgers, loaded pizzas, crispy chicken, sizzling shawarmas and
          fresh Ethiopian juices — all under one roof in Bole, Addis Ababa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#menu"
            className="flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-lg font-bold text-black transition hover:scale-105 hover:bg-yellow-300"
          >
            <ShoppingBag size={22} />
            Order Now
          </a>

          <a
            href="#about"
            className="flex items-center gap-2 rounded-full border-2 border-yellow-400 px-8 py-4 text-lg font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
          >
            Our Story
            <ArrowRight size={22} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}