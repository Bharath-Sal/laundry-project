"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Clock, ArrowRight, RefreshCw, Sparkles, ShoppingBag, Plus, Minus } from "lucide-react";

interface ServiceItemPricing {
  id: string;
  name: string;
  category: "apparel" | "couture" | "premium-pressing" | "leather-shoe";
  price: number; // in INR
  unit: string;
  processingTime: number; // in hours
}

const pricingMenu: ServiceItemPricing[] = [
  { id: "shirt", name: "Premium Cotton Shirt", category: "apparel", price: 90, unit: "piece", processingTime: 24 },
  { id: "suit", name: "Executive 2-Piece Suit", category: "couture", price: 450, unit: "set", processingTime: 48 },
  { id: "saree-silk", name: "Kanjeevaram / Heavy Silk Saree", category: "couture", price: 380, unit: "piece", processingTime: 72 },
  { id: "lehenga", name: "Designer Heavy Lehenga", category: "couture", price: 850, unit: "set", processingTime: 72 },
  { id: "casual-pant", name: "Chinos & Casual Trousers", category: "apparel", price: 90, unit: "piece", processingTime: 24 },
  { id: "sneakers", name: "Luxury Suede/Leather Sneakers", category: "leather-shoe", price: 950, unit: "pair", processingTime: 96 },
  { id: "designer-jacket", name: "Designer Bomber/Leather Jacket", category: "leather-shoe", price: 1200, unit: "piece", processingTime: 96 },
  { id: "pressing-suit", name: "Steam Ironing - Executive Suit", category: "premium-pressing", price: 120, unit: "piece", processingTime: 12 }
];

export default function Pricing() {
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [expressDelivery, setExpressDelivery] = useState<boolean>(false);

  const handleIncrement = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecrement = (id: string) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[id] <= 1) {
        delete updated[id];
      } else {
        updated[id] -= 1;
      }
      return updated;
    });
  };

  const handleReset = () => {
    setSelectedItems({});
    setExpressDelivery(false);
  };

  // Dynamic calculations
  const totals = useMemo(() => {
    let subtotal = 0;
    let maxHours = 24;
    let itemCount = 0;

    Object.entries(selectedItems).forEach(([itemId, qty]) => {
      const item = pricingMenu.find((p) => p.id === itemId);
      if (item) {
        subtotal += item.price * qty;
        itemCount += qty;
        if (item.processingTime > maxHours) {
          maxHours = item.processingTime;
        }
      }
    });

    // Express multiplier (Saves 50% time, adds 50% premium cost)
    if (expressDelivery && subtotal > 0) {
      subtotal = subtotal * 1.5;
      maxHours = Math.max(12, maxHours * 0.5);
    }

    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const total = subtotal + cgst + sgst;

    return {
      subtotal: Math.round(subtotal),
      itemCount,
      cgst: Math.round(cgst),
      sgst: Math.round(sgst),
      total: Math.round(total),
      timelineHours: maxHours
    };
  }, [selectedItems, expressDelivery]);

  return (
    <section id="pricing" className="relative py-24 bg-[#0A0F2C] overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#7C3AED]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#00D4AA]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-md"
          >
            <Calculator className="w-4 h-4 text-[#00D4AA]" />
            <span className="text-xs font-semibold tracking-wider text-[#00D4AA] uppercase font-sans">
              Instant Valuation
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6"
          >
            Transparent{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] bg-clip-text text-transparent">
              Luxury Estimator
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto text-base md:text-lg text-slate-400 font-medium font-sans"
          >
            Calculate the exact valuation of your dry cleaning and luxury wash. No hidden surcharges, no unexpected fees.
          </motion.p>
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Item list selector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-xl">
              
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#00D4AA]" />
                  Select Your Wardrobe Items
                </h3>
                {totals.itemCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-sans"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Bag
                  </button>
                )}
              </div>

              {/* Item selection deck */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {pricingMenu.map((item) => {
                  const qty = selectedItems[item.id] || 0;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                        qty > 0
                          ? "bg-white/[0.03] border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                          : "bg-transparent border-white/[0.04] hover:border-white/10"
                      }`}
                    >
                      <div>
                        <h4 className="text-base font-bold text-white mb-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 font-sans">
                          <span>₹{item.price} / {item.unit}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {item.processingTime} hrs delivery
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        {qty > 0 ? (
                          <div className="flex items-center gap-3.5 bg-[#0A0F2C]/60 p-1.5 rounded-xl border border-white/5">
                            <button
                              onClick={() => handleDecrement(item.id)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-[#7C3AED]/20 hover:text-white text-slate-300 transition-all duration-200"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-black text-white w-6 text-center font-mono">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.id)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-[#00D4AA]/20 hover:text-white text-slate-300 transition-all duration-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-[#00D4AA] border border-white/[0.06] hover:border-[#00D4AA] text-xs font-bold text-white transition-all duration-300 scale-100 hover:scale-[1.05]"
                          >
                            Add to Bag
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right: Estimated Invoice display */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1.5 rounded-[36px] bg-gradient-to-r from-[#00D4AA]/30 to-[#7C3AED]/30 blur-[8px] opacity-75 pointer-events-none" />

            <div className="relative p-8 md:p-10 rounded-[30px] bg-[#0E153A] border border-white/10 backdrop-blur-3xl overflow-hidden flex flex-col justify-between min-h-[500px]">
              {/* Gloss element overlay */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00D4AA]/15 to-transparent rounded-full pointer-events-none" />
              
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00D4AA]" />
                    Estimated Order Summary
                  </h3>
                  <div className="text-xs font-bold text-[#00D4AA] bg-[#00D4AA]/10 px-2.5 py-1 rounded-full font-sans">
                    Hyd Area Gate
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {totals.itemCount > 0 ? (
                    <motion.div
                      key="filled-invoice"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Price calculations */}
                      <div className="space-y-3 font-sans text-sm font-semibold text-slate-400">
                        <div className="flex justify-between">
                          <span>Selected Items ({totals.itemCount})</span>
                          <span className="text-white font-mono">₹{totals.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Central GST (9%)</span>
                          <span className="text-white font-mono">₹{totals.cgst}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>State GST (9%)</span>
                          <span className="text-white font-mono font-sans">₹{totals.sgst}</span>
                        </div>
                        
                        {/* Dynamic timeline bar */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mt-4 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-[#00D4AA] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Estimated Completion
                            </span>
                            <span className="text-white">
                              {totals.timelineHours >= 24
                                ? `${Math.round(totals.timelineHours / 24)} Days`
                                : `${totals.timelineHours} Hours`}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#00D4AA] to-[#7C3AED]"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </div>

                        {/* Express Delivery Checkbox */}
                        <div
                          onClick={() => setExpressDelivery(!expressDelivery)}
                          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            expressDelivery
                              ? "bg-[#7C3AED]/10 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                              : "bg-white/[0.01] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-white block mb-0.5">
                              ⚡ Upgrade to Express Delivery
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 block">
                              Saves 50% processing time (+50% premium)
                            </span>
                          </div>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            expressDelivery ? "bg-[#7C3AED] border-[#7C3AED]" : "border-white/20 bg-transparent"
                          }`}>
                            {expressDelivery && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Total Pricing display */}
                      <div className="border-t border-white/10 pt-6 mt-8 flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-white">Estimated Total</span>
                        <div className="text-right">
                          <span className="text-4xl font-black text-white tracking-tight font-sans">
                            ₹{totals.total}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 block font-sans uppercase tracking-wider mt-1">
                            Inclusive of taxes
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-invoice"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-16 space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 mx-auto flex items-center justify-center text-slate-500">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          Bag is Currently Empty
                        </h4>
                        <p className="text-xs text-slate-500 max-w-[200px] mx-auto font-sans leading-relaxed">
                          Add some laundry or pressing services on the left to generate your custom invoice quote.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action booking CTA */}
              <div className="mt-8 relative z-10">
                <a
                  href={totals.itemCount > 0 ? "#booking" : "#services"}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-black tracking-wide text-white transition-all duration-300 scale-100 hover:scale-[1.01] ${
                    totals.itemCount > 0
                      ? "bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] shadow-[0_0_30px_rgba(0,212,170,0.2)] hover:shadow-[0_0_40px_rgba(0,212,170,0.35)] cursor-pointer"
                      : "bg-white/[0.02] border border-white/5 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Proceed to Schedule
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="text-[11px] font-bold text-slate-500 text-center mt-3 flex items-center justify-center gap-1.5 font-sans">
                  <span>Minimum pick-up order ₹250</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>Free pick-up & delivery</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
