"use client";

import { motion } from "framer-motion";
import { Calendar, Truck, Sparkles, Clock, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: Calendar,
    title: "1. Book Your Concierge",
    description: "Schedule a convenient pickup time through our booking portal. Select individual items or let our experts categorize them upon collection.",
    color: "from-[#00D4AA] to-[#00ebd0]"
  },
  {
    icon: Truck,
    title: "2. Valet Collection",
    description: "Our premium valet arrives at your doorstep in an eco-friendly vehicle. We transport your garments in protective travel bags.",
    color: "from-[#5F7CFA] to-[#7C3AED]"
  },
  {
    icon: Sparkles,
    title: "3. Artisanal Care",
    description: "Each garment is individually inspected, treated for stains, and processed using organic solvents and precise temperature controls.",
    color: "from-[#7C3AED] to-[#B33AED]"
  },
  {
    icon: Clock,
    title: "4. Delivered in 24h",
    description: "Fresh, crisp, and beautifully packaged. Your wardrobe is returned to you exactly when promised, ready to wear.",
    color: "from-[#00D4AA] to-[#7C3AED]"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 bg-[#0A0F2C] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] mb-6"
          >
            <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
            <span className="text-xs font-bold tracking-wider text-white uppercase">The WashClub Process</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white tracking-tight"
          >
            Seamless fabric care, <br />
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] bg-clip-text text-transparent">
              designed for your lifestyle.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
            >
              {/* Top border highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-r ${step.color}`} />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <step.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
