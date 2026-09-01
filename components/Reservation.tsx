"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock3, Users, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type ReservationForm = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
};

const initialForm: ReservationForm = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  requests: "",
};

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

export default function Reservation() {
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedReservation, setSubmittedReservation] =
    useState<ReservationForm | null>(null);
  const [error, setError] = useState("");

  const minimumDate = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanedPhone = form.phone.replace(/\D/g, "");

    if (cleanedPhone.length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!form.date || form.date < minimumDate) {
      setError("Please select a valid reservation date.");
      return;
    }

    if (!form.time) {
      setError("Please select a preferred time slot.");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const completedReservation = {
      ...form,
      phone: cleanedPhone,
    };

    setSubmittedReservation(completedReservation);
    setShowConfirmation(true);
    setForm(initialForm);
    setLoading(false);
  };

  return (
    <>
      <section id="reservation" className="bg-[#24170f] px-4 py-14 sm:px-6 sm:py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Text & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400 sm:text-sm">
              Reservation
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl lg:text-5xl text-white">
              Book a Table at Wow Burger
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-[#d7c8ba] sm:mt-4 sm:text-sm sm:leading-7">
              Planning a group burger feast, birthday party, or weekend gathering at
              Wow Burger Bole? Reserve your spot in advance and we&apos;ll have your table
              ready.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-2xl border border-yellow-400/20 bg-white/5 p-4 sm:p-5">
                <Clock3 className="text-yellow-400" size={24} />
                <p className="mt-3 text-xs font-bold text-yellow-400 sm:text-sm">
                  Opening Hours
                </p>
                <p className="mt-1 text-xs text-[#d7c8ba]">
                  Monday – Sunday
                </p>
                <p className="text-xs text-yellow-400/90 font-bold">
                  10:00 AM – 12:00 AM
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-white/5 p-4 sm:p-5">
                <CalendarDays className="text-yellow-400" size={24} />
                <p className="mt-3 text-xs font-bold text-yellow-400 sm:text-sm">
                  Group & Event Bookings
                </p>
                <p className="mt-1 text-xs text-[#d7c8ba]">
                  Seating available for birthdays & group hangouts.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Responsive Form Container */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#f7f0df] p-4 sm:p-6 md:p-8 text-[#20170f] shadow-2xl"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {/* Full Name */}
              <div className="col-span-1 sm:col-span-1">
                <label className="mb-1 block text-xs font-bold text-[#6b4f2b]">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#d8c9aa] bg-white px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-[#a67c00] focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Phone */}
              <div className="col-span-1 sm:col-span-1">
                <label className="mb-1 block text-xs font-bold text-[#6b4f2b]">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="0911 234 567"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#d8c9aa] bg-white px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-[#a67c00] focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Date */}
              <div className="col-span-1 sm:col-span-1">
                <label className="mb-1 block text-xs font-bold text-[#6b4f2b]">
                  Reservation Date *
                </label>
                <input
                  required
                  type="date"
                  name="date"
                  min={minimumDate}
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#d8c9aa] bg-white px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-[#a67c00] focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Time */}
              <div className="col-span-1 sm:col-span-1">
                <label className="mb-1 block text-xs font-bold text-[#6b4f2b]">
                  Preferred Time *
                </label>
                <select
                  required
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#d8c9aa] bg-white px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-[#a67c00] focus:ring-2 focus:ring-yellow-400/20"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guests */}
              <div className="col-span-1 sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-[#6b4f2b]">
                  Number of Guests
                </label>
                <div className="relative">
                  <Users
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a67c00]"
                  />
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d8c9aa] bg-white py-2.5 pl-10 pr-4 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-[#a67c00] focus:ring-2 focus:ring-yellow-400/20"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6+">6+ Guests (Party)</option>
                  </select>
                </div>
              </div>

              {/* Requests */}
              <div className="col-span-1 sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-[#6b4f2b]">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  name="requests"
                  placeholder="Birthday surprise, outdoor seating, fast food pre-order, etc."
                  value={form.requests}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-[#d8c9aa] bg-white px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-[#a67c00] focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>
            </div>

            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#20170f] py-3 sm:py-3.5 text-xs sm:text-sm font-black text-yellow-400 transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
            >
              {loading ? "Submitting Booking..." : "Book My Table"}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && submittedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmation(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-[#f7f0df] p-6 text-center text-[#20170f] shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#20170f] text-white transition hover:bg-yellow-400 hover:text-black"
              >
                <X size={18} />
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl font-black">
                Reservation Confirmed!
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#6b5a48]">
                Thank you, <span className="font-bold">{submittedReservation.name}</span>! Your table request at Wow Burger Bole has been received.
              </p>

              <div className="mt-4 space-y-2 rounded-2xl bg-white p-4 text-left text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[#6b5a48]">Date</span>
                  <span className="font-bold">
                    {new Date(
                      `${submittedReservation.date}T00:00:00`
                    ).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-[#6b5a48]">Time</span>
                  <span className="font-bold">
                    {submittedReservation.time}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-[#6b5a48]">Guests</span>
                  <span className="font-bold">
                    {submittedReservation.guests}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[11px] sm:text-xs text-[#6b5a48]">
                Our team in Bole will confirm your spot via call or SMS shortly.
              </p>

              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="mt-5 w-full rounded-xl bg-[#20170f] py-3 text-xs sm:text-sm font-black text-yellow-400 transition hover:bg-black"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}