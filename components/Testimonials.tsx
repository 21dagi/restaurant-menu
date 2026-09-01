import { Star } from "lucide-react";

const reviews = [
  {
    name: "Mikiyas Tadesse",
    location: "Bole, Addis Ababa",
    review:
      "The Double Smash Burger is genuinely incredible. Crispy edges, juicy centre, perfect sauce. Comes here every Friday with family!",
  },
  {
    name: "Hana Girma",
    location: "Kazanchis, Addis Ababa",
    review:
      "Tried the layered juice and the BBQ Chicken Pizza together — what a combo. The service is fast and the place is super clean. Big fan!",
  },
  {
    name: "Dawit Bekele",
    location: "Mexico Square, Addis Ababa",
    review:
      "Wow Burger is exactly what Addis needed. Real smash burgers with fresh bread. The avocado juice alone is worth the trip.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#111111] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-yellow-400">
            Customer Love
          </p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            What Addis is saying
          </h2>
        </div>

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-8"
            >
              <div className="flex gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="mt-6 leading-8 text-gray-300">"{review.review}"</p>

              <div className="mt-6">
                <h3 className="font-black text-yellow-400">{review.name}</h3>
                <p className="text-xs text-gray-600">{review.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}