import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Athulraj",
    type: "Wedding Photos",
    image: "/athulraj.jpg",
    review: "The photos came out much better than expected, especially the low-light shots! You didn't miss a single moment of the wedding, and I don't think anyone else can provide such incredible quality in this budget. Thank you so much guys ❤️",
  },
  {
    name: "Chindu",
    type: "Cinematic Video",
    image: "/chindu.jpg",
    review: "What you did is one of the best I have seen so far. I've been searching for 7 months... the cinematic video you guys did is one of the best! All my friends and office colleagues are showering with praises.",
  },
  {
    name: "Anandha Lekshmi",
    type: "Wedding Ceremony",
    image: "/anandha_lekshmi.jpg",
    review: "Thank you so much to the whole team for the beautiful photo frame and for capturing our big day perfectly! ❤️❤️",
  },
  {
    name: "Deepak Kollam",
    type: "Candid Portraits",
    image: "/deepak.jpg",
    review: "Superb work bro! We had a great experience with the team. I am someone who doesn't pose for photos at all, but you guys managed to capture such incredible shots and made me feel so comfortable.",
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const TestimonialSection = () => {
  return (
    <section className="w-full bg-[#f5f5f3] py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* TOP TAG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <span
            className="px-7 py-3 rounded-full bg-[#ececea] text-[#5e665f] text-[16px] tracking-wide"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Testimonials
          </span>
        </motion.div>

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mt-10"
        >
          <h2
            className="text-[62px] md:text-[80px] leading-[0.95] tracking-[-4px] text-black font-normal"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            What our couples say
          </h2>
          <p
            className="mt-8 text-[22px] leading-relaxed text-[#6b736c] max-w-2xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Every wedding is a once-in-a-lifetime moment. We're honoured our couples
            trusted us to tell their story.
          </p>
        </motion.div>

        {/* TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-20">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-[#ececea] rounded-[36px] p-10 min-h-[420px] flex flex-col justify-between cursor-default"
            >
              {/* TOP */}
              <div>
                {/* STARS */}
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} fill="black" stroke="black" />
                  ))}
                </div>

                {/* REVIEW */}
                <p
                  className="mt-8 text-[24px] leading-[1.5] tracking-[-0.5px] text-[#66706a]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  "{item.review}"
                </p>
              </div>

              {/* PROFILE */}
              <div className="flex items-center gap-5 mt-12">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3
                    className="text-[22px] leading-none tracking-[-0.5px] text-black"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.name}
                  </h3>
                  <p
                    className="mt-1.5 text-[16px] text-[#727972]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.type}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;