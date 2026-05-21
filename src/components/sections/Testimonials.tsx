"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ananya Rao",
    role: "Corporate Executive",
    quote: "WashDoor makes wardrobe care effortless. Pickup, cleaning, and delivery are always seamless, and my suits return looking brand new.",
  },
  {
    name: "Rohit Verma",
    role: "Designer Entrepreneur",
    quote: "The premium fabric handling is unmatched. I love the mix of clean dark styling and crisp white details in the experience.",
  },
  {
    name: "Meera Joshi",
    role: "Interior Stylist",
    quote: "Their valet schedule is convenient, the clothes are returned fresh, and the UI feels premium yet approachable.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 bg-slate-50 text-slate-900">
      <div className="absolute inset-x-0 top-0 h-56 bg-white shadow-sm" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200"
          >
            <Star className="w-4 h-4 text-[#00D4AA]" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Customer Stories
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-black tracking-tight"
          >
            Real feedback from Hyderabad’s modern wardrobes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 max-w-2xl mx-auto text-sm text-slate-600"
          >
            Every wash, press and delivery is designed to feel premium yet effortless, with a perfect white-and-dark balance across the experience.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400 font-bold">Customer</p>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{testimonial.name}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#00D4AA]/10 text-[#00D4AA]">
                  <Quote className="w-5 h-5" />
                </div>
              </div>

              <p className="text-base leading-8 text-slate-700">“{testimonial.quote}”</p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {testimonial.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
