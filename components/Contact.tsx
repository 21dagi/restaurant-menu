"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

type Settings = {
  address: string; phone: string; email: string; openingHours: string; openingDays: string;
};

export default function Contact() {
  const [s, setS] = useState<Settings>({
    address: "Bole Road, Addis Ababa, Ethiopia",
    phone: "+251 91 123 4567",
    email: "order@wowburger.et",
    openingHours: "10:00 AM – 12:00 AM",
    openingDays: "Monday – Sunday",
  });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data: Settings) => setS(data)).catch(() => {});
  }, []);

  const contactDetails = [
    { icon: MapPin, title: "Address", value: s.address },
    { icon: Phone, title: "Phone", value: s.phone },
    { icon: Mail, title: "Email", value: s.email },
    { icon: Clock, title: "Opening Hours", value: `${s.openingDays}\n${s.openingHours}` },
  ];

  return (
    <section id="contact" className="bg-[#f7f0df] px-4 py-16 sm:px-6 sm:py-24 text-[#20170f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-[#a67c00]">Contact Us</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl md:text-5xl">Visit Wow Burger</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs text-[#6b5a48] sm:text-sm">
            Visit us in Bole for fresh smash burgers, wood-fired pizzas, and delicious Ethiopian juices.
          </p>
        </div>

        {/* 1 Row Centered & Horizontally Scrollable without visible scrollbar */}
        <div className="mt-10 flex flex-nowrap overflow-x-auto justify-start md:justify-center items-stretch gap-4 pb-2 no-scrollbar snap-x snap-mandatory">
          {contactDetails.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="shrink-0 w-[230px] sm:w-[260px] snap-center flex flex-col items-center justify-between rounded-3xl border border-[#d8c9aa] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#20170f] text-yellow-400 p-2.5">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-base font-black">{item.title}</h3>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[#6b5a48] sm:text-sm">{item.value}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}