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
    <section className="bg-[#111111] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-yellow-400">
            Customer Love
          </p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl md:text-5xl text-white">
            What Addis is saying
          </h2>
          <p className="mt-2 text-xs text-gray-500 sm:text-sm">Swipe or scroll horizontally to read reviews</p>
        </div>

        {/* 1 Row Horizontal Scrollable Container */}
        <div className="mt-10 flex flex-nowrap overflow-x-auto gap-4 sm:gap-6 pb-4 custom-scrollbar snap-x snap-mandatory">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="shrink-0 w-[280px] sm:w-[340px] md:w-[380px] snap-start flex flex-col justify-between rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 sm:p-8"
            >
              <div>
                <div className="flex gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:mt-5 sm:text-base sm:leading-7">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <h3 className="font-black text-yellow-400 text-sm sm:text-base">{review.name}</h3>
                <p className="text-[11px] text-gray-500 sm:text-xs">{review.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}