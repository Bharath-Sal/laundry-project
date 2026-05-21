"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { name: "Services", href: "#services" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4",
          isScrolled
            ? "bg-[#0A0F2C]/92 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-luxuryTeal to-luxuryPurple opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-[#0A0F2C] p-1.5 rounded-full border border-white/10">
                <Sparkles className="w-5 h-5 text-luxuryTeal group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
              Wash<span className="text-luxuryTeal">Door</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="relative text-sm font-medium text-luxuryTextSecondary hover:text-white transition-colors duration-200 py-2 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-luxuryTeal to-luxuryPurple scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
              </a>
            ))}
          </div>

          {/* Action Button & Hamburger */}
          <div className="flex items-center gap-4">
            <Link 
              href="/auth"
              className="hidden md:flex p-2 rounded-full border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all shadow-sm"
              title="Sign In / Register"
            >
              <User className="w-5 h-5" />
            </Link>
            
            <Link 
              href="/booking"
              className="hidden md:flex p-2 rounded-full border border-slate-200 hover:bg-[#E6FFFA] hover:border-[#00D4AA]/40 text-slate-700 hover:text-[#0A0F2C] transition-all shadow-sm relative"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#00D4AA] rounded-full border border-[#0A0F2C]" />
            </Link>

            <Button
              className="hidden md:inline-flex relative overflow-hidden group/btn bg-white border border-slate-300 hover:border-[#00D4AA]/40 text-slate-900 font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(0,212,170,0.12)]"
              onClick={() => {
                const target = document.querySelector("#pricing");
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="relative z-10 text-slate-900 group-hover/btn:text-white transition-colors duration-300">
                Book Now
              </span>
              <span className="absolute inset-0 bg-luxuryTeal scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-luxuryTeal" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Slide Down */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 md:hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="text-lg font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 py-2 border-b border-slate-200"
                >
                  {item.name}
                </a>
              ))}
              <Button
                className="w-full mt-4 bg-luxuryTeal hover:bg-luxuryTeal/90 text-luxuryDark font-bold rounded-full py-3 shadow-[0_0_20px_rgba(0,212,170,0.3)]"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const target = document.querySelector("#pricing");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
