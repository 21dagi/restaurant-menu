"use client";

import { motion } from "framer-motion";
import { Award, Flame, Leaf } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Flame,
      title: "Fresh-Pressed Every Time",
      description: "Every patty is hand-pressed and smash-cooked to order — never frozen, never reheated.",
    },
    {
      icon: Leaf,
      title: "Locally Sourced Ingredients",
      description: "Fresh vegetables, breads and juices sourced daily from Addis Ababa markets.",
    },
    {
      icon: Award,
      title: "Addis Favourite Since 2018",
      description: "Voted Addis Ababa's #1 Burger Joint three years running by our loyal community.",
    },
  ];

  return (
    <section id="about" className="bg-[#f7f0df] px-6 py-24 text-[#20170f]">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative min-h-[520px] overflow-hidden rounded-[2rem]"
          style={{
            backgroundImage: "url('/images/about.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-6 rounded-2xl bg-[#d4af37] p-6 text-black">
            <p className="text-4xl font-black">7+</p>
            <p className="font-bold">Years Serving Addis</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-bold uppercase tracking-[0.3em] text-[#a67c00]">
            Our Story
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Born in Bole. Built for Everyone.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#6b5a48]">
            Wow Burger started with one mission — to bring the world&apos;s best
            fast food to Ethiopia with a local soul. From our signature smash
            burgers and wood-fired pizzas to our famous layered juices and Spris,
            every item on our menu is crafted to make you say &quot;Wow!&quot;
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#d8c9aa] bg-white p-5"
                >
                  <Icon className="text-[#a67c00]" size={30} />
                  <h3 className="mt-4 font-black">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b5a48]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}