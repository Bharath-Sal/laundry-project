"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shirt, Flame, ChevronRight, Gem, ShieldCheck, CheckCircle, LucideIcon, Droplets, Truck, Shield, Leaf } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const servicesList: ServiceItem[] = [
  {
    id: "steam-ironing",
    title: "Steam Ironing & Pressing",
    subtitle: "Crisp, Wrinkle-Free Finish — Every Garment",
    icon: Flame,
    description: "Professional Italian steam-table ironing for everyday essentials, plus advanced vacuum suction pressing for executive suits and blazers. Every garment gets the right level of care to lock in a sharp crease without fabric shine.",
    techBadges: ["Italian Steam Tech", "Vacuum Suction Pressing", "Zero-Shine Promise", "Same Day Available"],
    timeline: "Same Day Available",
    pricingEstimate: "Starts at ₹15 / piece",
    gradient: "from-[#00D4AA] to-[#0A0F2C]",
    details: [
      "Everyday Wear — T-Shirt: ₹15/piece",
      "Everyday Wear — Shirt: ₹15/piece",
      "Everyday Wear — Trouser: ₹15/piece",
      "Executive Suits & Blazers — Vacuum Suction Press: ₹40/item"
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

export default function Services() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section id="services" className="relative py-24 bg-white overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#00D4AA]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-200 mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-slate-900 uppercase font-sans">
              Elite Cleanse Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight mb-6"
          >
            Crafted for Hyderabad’s{' '}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] bg-clip-text text-transparent">
              Discerning Wardrobe
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-600 font-medium font-sans"
          >
            We merge artisanal garment heritage techniques with state-of-the-art Italian dry cleaning technology to deliver couture-level finishings.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {servicesList.map((service, idx) => {
            const IconComponent = service.icon;
            const isExpanded = activeCard === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setActiveCard(isExpanded ? null : service.id)}
                className="relative group cursor-pointer min-h-[220px]"
              >
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-slate-200/20 to-transparent group-hover:from-[#00D4AA]/20 group-hover:to-[#7C3AED]/20 transition-all duration-500 pointer-events-none blur-sm" />
                <div className="relative h-full p-8 md:p-10 rounded-3xl bg-white shadow-sm border border-slate-200 group-hover:border-slate-300 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-white/[0.05] to-transparent rounded-full opacity-100 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

                  <div>
                    <div className="flex items-start justify-between mb-8">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-10 text-slate-950 relative`}>
                        <IconComponent className="w-7 h-7 relative z-10 text-[#00D4AA] transition-colors duration-300" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00D4AA] bg-[#E6FFFA] px-3 py-1 rounded-full font-sans tracking-wide">
                          {service.timeline}
                        </span>
                        <div className="text-xs font-medium text-slate-500 mt-2 font-sans">
                          {service.pricingEstimate}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-950 mb-2 tracking-tight group-hover:text-[#00D4AA] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600 mb-4 font-sans tracking-wide">
                      {service.subtitle}
                    </p>
                    <p className="text-slate-700 font-medium text-base mb-6 leading-relaxed font-sans">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {service.techBadges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md tracking-wider uppercase font-sans"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 text-sm font-bold text-[#00D4AA] hover:text-[#0A0F2C] transition-colors font-sans mt-2"
                    >
                      <span>{isExpanded ? "Hide Details" : "View Couture Process"}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="overflow-hidden mt-6 pt-6 border-t border-slate-200"
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#00D4AA]" />
                            Our Premium Service Protocol
                          </h4>
                          <ul className="space-y-3">
                            {service.details.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed font-sans">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 backdrop-blur-md">
            <span className="text-sm font-semibold text-slate-600 font-sans">
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

        {/* --- Trust/Quality Section --- */}
        <div className="mt-32 relative z-10">
          <div className="text-center mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight"
            >
              The Foldo Promise
            </motion.h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Droplets,
                title: "Deep Stain Treatment",
                desc: "We meticulously pre-treat and target tough stains using specialized fabric-safe spotting agents before the main wash."
              },
              {
                icon: Leaf,
                title: "Skin-Safe Chemistry",
                desc: "All our detergents and solvents are rigorously vetted to be gentle on sensitive skin and friendly to the environment."
              },
              {
                icon: Shield,
                title: "Fabric-Specific Care",
                desc: "We don't do batch processing. Every fabric type gets its own tailored temperature, cycle, and finishing process."
              },
              {
                icon: Truck,
                title: "Complimentary Delivery",
                desc: "Enjoy the convenience of door-to-door service. We pick up and deliver your garments directly to you at no extra charge."
              }
            ].map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-[#00D4AA]/50 hover:shadow-lg hover:shadow-[#00D4AA]/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center mb-4">
                    <PillarIcon className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{pillar.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* --- FAQ Section --- */}
        <div className="mt-32 max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight"
            >
              Frequently Asked Questions
            </motion.h3>
          </div>
          <Accordion className="w-full space-y-4">
            {[
              {
                q: "What services do you offer?",
                a: "We provide a comprehensive range of premium garment care services, including everyday executive wash & fold, high-end couture and heritage dry cleaning, steam ironing, and specialized leather or sneaker restoration."
              },
              {
                q: "Do you offer free pickup and delivery?",
                a: "Yes, we proudly offer complimentary pickup and delivery across our service areas. Our team will collect your items and return them fresh and professionally packaged straight to your door."
              },
              {
                q: "How long does dry cleaning take?",
                a: "Our standard turnaround for premium dry cleaning and couture care is typically 48 to 72 hours. This ensures we have adequate time for meticulous stain pre-treatment and hand-finishing."
              },
              {
                q: "Will dry cleaning shrink my clothes?",
                a: "Not at all. We use advanced hydrocarbon solvents and strict temperature controls that are specifically designed to clean delicate fibers without causing any shrinkage or distortion."
              },
              {
                q: "What areas in Hyderabad do you serve?",
                a: "We cater to numerous neighborhoods across Hyderabad. Please enter your pincode during the booking process or contact our support team to verify service availability in your exact location."
              },
              {
                q: "Do you offer subscription/recurring pickup plans?",
                a: "Yes! We offer flexible subscription plans for our regular clients. You can easily set up weekly or bi-weekly scheduled pickups so you never have to worry about laundry day again."
              },
              {
                q: "How is pricing calculated?",
                a: "Pricing depends on the service required. Everyday wash & fold is calculated per kilogram, whereas steam ironing, dry cleaning, and restorations are priced per individual item due to the specialized care involved."
              },
              {
                q: "Is steam ironing available same-day?",
                a: "Absolutely. We offer an expedited same-day steam ironing service for your daily office wear to ensure you always have a crisp, wrinkle-free look exactly when you need it."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-slate-200 rounded-2xl px-6 data-[state=open]:shadow-sm transition-all">
                <AccordionTrigger className="text-left font-bold text-slate-800 hover:text-[#00D4AA] text-base py-4 hover:no-underline text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 font-sans leading-relaxed text-base pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
