import React, { useState } from "react";
import pic1 from "../../assets/images/pic1.jpeg";
import pic2 from "../../assets/images/pic2.jpeg";
import pic3 from "../../assets/images/pic3.jpeg";
import pic4 from "../../assets/images/pic4.jpeg";

const segments = [
  {
    title: "Bridal Portraits",
    image: pic1,
  },
  {
    title: "Couple Stories",
    image: pic2,
  },
  {
    title: "Venue Details",
    image: pic3,
  },
  {
    title: "Fine Art Moments",
    image: pic4,
  },
];

export const Nicklo = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="w-screen flex min-h-screen bg-gradient-to-bflex items-center justify-center ">
      <div className="relative w-full max-w-[1500px] h-[650px] overflow-hidden ">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ backgroundImage: `url(${segments[active].image})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t" />

        <div className="absolute left-8 top-8 z-20 max-w-[360px] text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            Wedding Photography
          </p>
          <h2 className="mt-3 text-5xl font-semibold leading-tight tracking-tight">
            Timeless moments crafted with light & emotion.
          </h2>
          <p className="mt-4 max-w-[320px] text-sm text-white/70 leading-6">
            Explore the signature visuals of each collection with a soft and
            elegant transition.
          </p>
        </div>

        <div className="relative z-10 flex h-full">
          {segments.map((item, index) => {
            const isActive = active === index;

            return (
              <button
                key={item.title}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={`relative flex-1 overflow-hidden border-r border-white transition-all duration-900 ease-out ${
                  isActive ? "flex-[2.2]" : "flex-1"
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 bg-white transition-all duration-900 ease-out ${
                    isActive
                      ? "h-[calc(100%-520px)] opacity-100"
                      : "h-0 opacity-0"
                  }`}
                />

                <div
                  className={`absolute inset-x-0 bottom-0 w-full bg-transparent  transition-all duration-900 ease-out ${
                    isActive ? "h-[520px]" : "h-full"
                  }`}
                />

                <div className="relative z-10 h-full flex items-end p-8">
                  <div className="space-y-4 text-left">
                    <p
                      className={`text-3xl font-semibold uppercase tracking-[0.15em] transition-all duration-900 ease-out ${
                        isActive ? "text-white" : "text-white/70"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`max-w-[280px] text-sm leading-6 transition-all duration-900 ease-out ${
                        isActive
                          ? "translate-y-0 opacity-100 text-white"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      A refined wedding photography experience with romantic
                      storytelling and elegant light.
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
