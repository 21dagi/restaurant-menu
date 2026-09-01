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
    <section id="contact" className="bg-[#f7f0df] px-6 py-24 text-[#20170f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-[#a67c00]">Contact Us</p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">Visit Wow Burger</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6b5a48]">
            Visit us for authentic cuisine, warm hospitality, and an unforgettable dining experience.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactDetails.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-[#d8c9aa] bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#20170f] text-yellow-400">
                  <Icon size={26} />
                </div>
                <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                <p className="mt-2 whitespace-pre-line leading-7 text-[#6b5a48]">{item.value}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}