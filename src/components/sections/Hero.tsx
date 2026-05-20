"use client";

import { useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Sparkles, ArrowRight, Play, CheckCircle2, Shield, Clock } from "lucide-react";

export default function Hero() {
  // Mouse coordinates for the spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Magnetic Button Position States
  const [magneticPos1, setMagneticPos1] = useState({ x: 0, y: 0 });
  const [magneticPos2, setMagneticPos2] = useState({ x: 0, y: 0 });

  const handleMagneticMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  ) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // Move up to 30% of distance
    setPos({ x: x * 0.3, y: y * 0.3 });
  };

  const resetMagnetic = (
    setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  ) => {
    setPos({ x: 0, y: 0 });
  };

  const scrollToSection = (id: string) => {
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#0A0F2C] overflow-hidden px-6 py-20 md:px-12 lg:px-24"
    >
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* GPU Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition duration-300 opacity-60 md:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              750px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 212, 170, 0.12),
              transparent 75%
            )
          `,
        }}
      />

      {/* Slow Moving Blurred Particle Circles (3D Depth) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Teal Bubble */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-luxuryTeal/5 filter blur-[100px]"
        />

        {/* Purple Bubble */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 50, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-luxuryPurple/5 filter blur-[120px]"
        />

        {/* Top Right Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-luxuryTeal/10 to-luxuryPurple/10 filter blur-[150px] opacity-40 pointer-events-none" />
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full z-10">
        
        {/* Left Side: Copywriting & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-8">
          
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-luxuryTeal animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-white uppercase">
              ✦ Hyderabad&apos;s Premium Garment Care
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Your Clothes <br />
            <span className="bg-gradient-to-r from-luxuryTeal via-[#5F7CFA] to-luxuryPurple bg-clip-text text-transparent drop-shadow-sm">
              Deserve Better.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-luxuryTextSecondary font-medium leading-relaxed max-w-2xl"
          >
            Professional laundry, dry cleaning, and bespoke garment care delivered direct to your doorstep in{" "}
            <span className="text-white font-semibold">Gachibowli</span>,{" "}
            <span className="text-white font-semibold">Banjara Hills</span>,{" "}
            <span className="text-white font-semibold">Kondapur</span>, and beyond.
          </motion.p>

          {/* CTA Buttons (Magnetic Hover) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            {/* Magnetic solid button */}
            <motion.button
              onMouseMove={(e) => handleMagneticMove(e, setMagneticPos1)}
              onMouseLeave={() => resetMagnetic(setMagneticPos1)}
              animate={{ x: magneticPos1.x, y: magneticPos1.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
              onClick={() => scrollToSection("#pricing")}
              className="group relative flex items-center justify-center gap-2 bg-luxuryTeal hover:bg-[#00ebd0] text-luxuryDark font-bold text-base rounded-full px-8 py-4 shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:shadow-[0_0_40px_rgba(0,212,170,0.5)] transition-all duration-300 pointer-events-auto"
            >
              Book a Pickup
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.button>

            {/* Outlined button */}
            <motion.button
              onMouseMove={(e) => handleMagneticMove(e, setMagneticPos2)}
              onMouseLeave={() => resetMagnetic(setMagneticPos2)}
              animate={{ x: magneticPos2.x, y: magneticPos2.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
              onClick={() => scrollToSection("#how-it-works")}
              className="group flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-base rounded-full px-8 py-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 pointer-events-auto"
            >
              <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform duration-300" />
              See How It Works
            </motion.button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-2.5 mt-4"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border border-[#0A0F2C] bg-gradient-to-br from-luxuryTeal/40 to-luxuryPurple/40 flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-luxuryTextSecondary">
              <span className="text-luxuryTeal">★ 4.9</span> rated by 10,000+ families in Hyderabad
            </p>
          </motion.div>

        </div>

        {/* Right Side: Floating Interactive Phone Mockup */}
        <div className="lg:col-span-5 flex justify-center items-center relative min-h-[500px]">
          
          {/* Subtle Glow behind Phone */}
          <div className="absolute inset-0 m-auto w-[280px] h-[480px] bg-luxuryTeal/20 filter blur-[80px] rounded-full pointer-events-none z-0" />

          {/* Floating badges with individual float loops */}
          
          {/* Badge 1: Top-Left */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-16 -left-6 z-30 flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-lg px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="w-6 h-6 rounded-full bg-luxuryTeal/20 flex items-center justify-center border border-luxuryTeal/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-luxuryTeal" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-luxuryTextSecondary font-medium leading-none">Status</p>
              <p className="text-xs font-bold text-white leading-tight">Picked Up ✓</p>
            </div>
          </motion.div>

          {/* Badge 2: Bottom-Right */}
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute bottom-20 -right-6 z-30 flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-lg px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="w-6 h-6 rounded-full bg-luxuryPurple/20 flex items-center justify-center border border-luxuryPurple/30">
              <Clock className="w-3.5 h-3.5 text-luxuryPurple" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-luxuryTextSecondary font-medium leading-none">Garment Care</p>
              <p className="text-xs font-bold text-white leading-tight">Delivered in 24hrs</p>
            </div>
          </motion.div>

          {/* Phone Shell */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="relative z-10 w-[300px] h-[600px] rounded-[50px] border-4 border-white/10 bg-[#070b21] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.05)] overflow-hidden"
          >
            {/* Phone Screen Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            {/* Dynamic Island Speaker */}
            <div className="absolute top-0 left-0 right-0 h-6 flex justify-center z-40">
              <div className="w-24 h-4 bg-black rounded-full border border-white/5 mt-1.5 shadow-inner" />
            </div>

            {/* Mobile Application Mock Screen */}
            <div className="relative h-full w-full bg-[#050819] rounded-[42px] pt-8 px-4 flex flex-col gap-4 text-left select-none">
              
              {/* Custom Navigation */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-heading font-extrabold text-sm tracking-tight text-white">
                  Wash<span className="text-luxuryTeal">Club</span>
                </span>
                <span className="text-[10px] text-luxuryTextSecondary font-semibold">Active Order</span>
              </div>

              {/* Status Header */}
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col gap-1.5 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-luxuryTeal bg-luxuryTeal/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    In Progress
                  </span>
                  <span className="text-[10px] font-semibold text-luxuryTextSecondary">ID: #WC-9831</span>
                </div>
                <h3 className="text-sm font-bold text-white">Premium Dry Cleaning</h3>
                <p className="text-[11px] text-luxuryTextSecondary">Banjara Hills, Ward 4</p>
              </div>

              {/* Progress Timeline */}
              <div className="flex flex-col gap-4 pl-2.5 py-2 relative border-l border-white/10">
                {/* Step 1: Confirmed */}
                <div className="relative pl-6">
                  {/* Indicator */}
                  <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-luxuryTeal border border-luxuryDark shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
                  <p className="text-xs font-bold text-white leading-none">Order Confirmed</p>
                  <p className="text-[10px] text-luxuryTextSecondary leading-relaxed mt-0.5">May 18, 10:30 AM</p>
                </div>

                {/* Step 2: Picked Up */}
                <div className="relative pl-6">
                  {/* Indicator */}
                  <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-luxuryTeal border border-luxuryDark shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
                  <p className="text-xs font-bold text-white leading-none">Picked Up by Agent</p>
                  <p className="text-[10px] text-luxuryTextSecondary leading-relaxed mt-0.5">May 18, 11:45 AM</p>
                </div>

                {/* Step 3: Expert Clean */}
                <div className="relative pl-6">
                  {/* Indicator */}
                  <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-luxuryTeal border border-luxuryDark animate-ping opacity-75" />
                  <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-luxuryTeal border border-luxuryDark shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
                  <p className="text-xs font-bold text-white leading-none">In Care: Fabric Analysis</p>
                  <p className="text-[10px] text-luxuryTeal font-medium leading-relaxed mt-0.5">Processing now...</p>
                </div>

                {/* Step 4: Out for Delivery */}
                <div className="relative pl-6 opacity-40">
                  {/* Indicator */}
                  <div className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-white/20 border border-luxuryDark" />
                  <p className="text-xs font-bold text-white leading-none">Out for Delivery</p>
                  <p className="text-[10px] text-luxuryTextSecondary leading-relaxed mt-0.5">Estimated: May 19, 10:00 AM</p>
                </div>
              </div>

              {/* Delivery Details Card */}
              <div className="mt-auto mb-4 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-3.5 rounded-2xl flex flex-col gap-2 shadow-inner">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-luxuryTeal" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                    WashDoor Care Guarantee
                  </span>
                </div>
                <p className="text-[10px] text-luxuryTextSecondary leading-normal">
                  Every fiber is scanned, dry-cleaned under controlled temperature, and hand-inspected by custom fabric technicians.
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
