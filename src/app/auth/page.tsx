"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setAuthError("");
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
    
    if (isMock) {
      setTimeout(() => {
        setUser({ email: `mock-${provider}-user@washclub.in`, user_metadata: { name: "Mock User" } });
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : `Failed to authenticate with ${provider}.`);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isMock) {
      setTimeout(() => {
        setUser({ email: authEmail || "guest@washclub.in", user_metadata: { name: authName || "Guest" } });
        setAuthLoading(false);
      }, 1000);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: { data: { name: authName, phone: authPhone } }
        });
        if (error) throw error;
        if (data.user) setUser(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
        if (data.user) setUser(data.user);
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Authentication error.");
    } finally {
      setAuthLoading(false);
    }
  };

  if (user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F2C] text-white px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,212,170,0.3)]">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
          <p className="text-slate-400 mb-8">{user.user_metadata?.name || user.email}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all">Home</Link>
            <Link href="/booking" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] font-bold shadow-[0_0_15px_rgba(0,212,170,0.2)] transition-all scale-100 hover:scale-[1.02]">Book Now</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0F2C] text-white p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00D4AA]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative w-full max-w-md p-8 rounded-[30px] bg-[#0E153A] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] z-10"
      >
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#00D4AA]" />
            {isSignUp ? "Create Account" : "Secure Login"}
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">Access your premium concierge valet service.</p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Full Name" className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="tel" required value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]" />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email Address" className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password" className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]" />
          </div>

          {authError && <span className="text-xs font-bold text-red-400 block">⚠️ {authError}</span>}

          <button type="submit" disabled={authLoading} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] text-sm font-black text-white hover:opacity-90 transition-all disabled:opacity-50 mt-2 shadow-lg">
            {authLoading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px bg-white/10 w-full" />
          <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap px-2">Or continue with</span>
          <div className="h-px bg-white/10 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button type="button" onClick={() => handleOAuthLogin('google')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/5 text-sm font-bold text-white transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" onClick={() => handleOAuthLogin('facebook')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-sm font-bold text-[#1877F2] transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
            {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
