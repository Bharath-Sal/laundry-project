"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shirt, Flame, ChevronRight, Gem, ShieldCheck, CheckCircle, LucideIcon } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
  techBadges: string[];
  timeline: string;
  details: string[];
  gradient: string;
  pricingEstimate: string;
}

export default function Services() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const servicesList: ServiceItem[] = [
    {
      id: "couture",
      title: "Couture & Heritage Care",
      subtitle: "For Hyderabad's Finest Silk & Embellishments",
      icon: Gem,
      description: "Artisanal dry cleaning utilizing eco-friendly, non-toxic hydrocarbon solvents. Designed specifically for heavy designer lehengas, delicate silk sarees, sherwanis, and luxury labels.",
      techBadges: ["Hydrocarbon Solvents", "Hand-Finished", "Bead Protection", "Anti-Fading"],
      timeline: "48 - 72 Hours Delivery",
      pricingEstimate: "Starts at ₹350 / item",
      gradient: "from-[#7C3AED] via-[#6366F1] to-[#00D4AA]",
      details: [
        "Pre-treatment stain spotting using premium Italian solvents.",
        "Delicate mesh-bag processing for embroidery & beadwork protection.",
        "Hydrocarbon technology: Zero chemical odors, zero fiber shrinkage.",
        "Premium breathable hanger wrapping & muslin dust cover packaging."
      ]
    },
    {
      id: "wash-fold",
      title: "Executive Wash & Fold",
      subtitle: "Sanitized Everyday Luxury Essentials",
      icon: Shirt,
      description: "Cleanliness redefined for daily wear. Cleaned in premium soft-water systems using pH-balanced organic detergents, sanitized at optimal temperatures, and vacuum-sealed.",
      techBadges: ["Soft-Water Tech", "Sanitized Wash", "Organic Detergent", "Vacuum Sealed"],
      timeline: "24 Hours Express Available",
      pricingEstimate: "Starts at ₹120 / kg",
      gradient: "from-[#00D4AA] to-[#3B82F6]",
      details: [
        "Individual machine processing—your garments are never mixed with others.",
        "99.9% anti-bacterial sterilization cycles.",
        "Tumble dried with organic wool dryer balls for ultra-soft fiber fluffing.",
        "Neatly folded and delivered in bio-degradable vacuum-sealed boxes."
      ]
    },
    {
      id: "steam-press",
      title: "Steam & Elite Crease Pressing",
      subtitle: "The Perfect Crisp Executive Wrinkle-Free Look",
      icon: Flame,
      description: "Crisp, pristine creases without fabric shine. Employs advanced Italian utility steam tables and vacuum irons that blow hot air to lock crease structures in shirts and suits.",
      techBadges: ["Italian Steam Tables", "Vacuum Suction Pressing", "Zero-Shine Promise", "Suit Hanger Pack"],
      timeline: "Same Day Delivery Available",
      pricingEstimate: "Starts at ₹40 / item",
      gradient: "from-[#3B82F6] to-[#7C3AED]",
      details: [
        "Industrial steam generation prevents standard direct-heat burning.",
        "Vacuum suction tables keep garments tightly aligned for crisp collar crease locking.",
        "Inspected under bright multi-directional lighting for perfect alignment.",
        "Delivered upright on heavy-duty plastic contoured shoulder hangers."
      ]
    },
    {
      id: "leather-restoration",
      title: "Suede, Leather & Sneaker Restores",
      subtitle: "Deep Rejuvenation for Luxury Accents",
      icon: Sparkles,
      description: "Complete hands-on detail cleaning, conditioning, and color restoration for designer leather handbags, premium suede jackets, and luxury sneakers.",
      techBadges: ["Hand-Detailed", "Leather Conditioning", "Suede Re-napping", "Odor Neutralizer"],
      timeline: "3 - 5 Days Delivery",
      pricingEstimate: "Starts at ₹800 / pair",
      gradient: "from-[#7C3AED] via-[#E0F2FE] to-[#00D4AA]",
      details: [
        "Strictly hands-on manual cleaning using soft horsehair brushes.",
        "Natural oils replenishment prevents leather dryness, peeling, and cracking.",
        "Premium color pigmentation matching for minor scratch and scuff repair.",
        "UV-sterilization and ozone-chamber deodorization."
      ]
    }
  ];

  return (
    <section id="services" className="relative py-24 bg-[#0A0F2C] overflow-hidden">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#00D4AA]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Separator */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-[#00D4AA] uppercase font-sans">
              Elite Cleanse Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6"
          >
            Crafted for Hyderabad’s{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] bg-clip-text text-transparent">
              Discerning Wardrobe
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-400 font-medium font-sans"
          >
            We merge artisanal garment heritage techniques with state-of-the-art Italian dry cleaning technology to deliver couture-level finishings.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {servicesList.map((service, idx) => {
            const IconComponent = service.icon;
            const isExpanded = activeCard === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setActiveCard(isExpanded ? null : service.id)}
                className="relative group cursor-pointer"
              >
                {/* Glow Boundary Backing */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#ffffff05] to-[#ffffff02] group-hover:from-[#00D4AA]/20 group-hover:to-[#7C3AED]/20 transition-all duration-500 pointer-events-none blur-sm" />
                
                {/* Inner Card Container */}
                <div className="relative h-full p-8 md:p-10 rounded-3xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-all duration-500 backdrop-blur-xl flex flex-col justify-between overflow-hidden">
                  
                  {/* Glowing Radial Spotlight inside Card */}
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-white/[0.02] to-transparent rounded-full opacity-100 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                  <div>
                    {/* Upper Header Row */}
                    <div className="flex items-start justify-between mb-8">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-10 text-white relative`}>
                        <div className="absolute inset-0 rounded-2xl bg-[#0A0F2C]/80 scale-[0.95]" />
                        <IconComponent className="w-7 h-7 relative z-10 text-[#00D4AA] group-hover:text-white transition-colors duration-300" />
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00D4AA] bg-[#00D4AA]/10 px-3 py-1 rounded-full font-sans tracking-wide">
                          {service.timeline}
                        </span>
                        <div className="text-xs font-medium text-slate-500 mt-2 font-sans">
                          {service.pricingEstimate}
                        </div>
                      </div>
                    </div>

                    {/* Service Titles */}
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-[#00D4AA] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 mb-4 font-sans tracking-wide">
                      {service.subtitle}
                    </p>
                    <p className="text-slate-400 font-medium text-base mb-6 leading-relaxed font-sans">
                      {service.description}
                    </p>

                    {/* Tech Floating Badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {service.techBadges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[11px] font-bold text-slate-300 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md tracking-wider uppercase font-sans hover:border-slate-500 transition-colors"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Care Details */}
                  <div>
                    <button
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#00D4AA] hover:text-white transition-colors font-sans mt-2"
                    >
                      <span>{isExpanded ? "Hide Details" : "View Couture Process"}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90 text-white" : ""}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden mt-6 pt-6 border-t border-white/5"
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#00D4AA]" />
                            Our Premium Service Protocol
                          </h4>
                          <ul className="space-y-3">
                            {service.details.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed font-sans">
                                <CheckCircle className="w-4 h-4 text-[#7C3AED] mt-0.5 shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md">
            <span className="text-sm font-semibold text-slate-400 font-sans">
              Have a bespoke fabric query, customized embroidery, or bulk commercial requests?
            </span>
            <Link
              href="/booking"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] text-sm font-bold text-white shadow-[0_0_20px_rgba(0,212,170,0.15)] hover:shadow-[0_0_30px_rgba(0,212,170,0.3)] transition-all duration-300 scale-100 hover:scale-[1.03]"
            >
              Consult Cleanse Specialist
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
