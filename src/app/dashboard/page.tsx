"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShoppingBag, 
  RefreshCw, LogOut, ChevronRight, CheckCircle2, Lock, Mail
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface RawDBOrder {
  id: string;
  pickup_date: string;
  pickup_slot: string;
  delivery_date: string;
  delivery_slot: string;
  is_express: boolean;
  total_amount: number;
  status: string;
  address: {
    address_line_1: string;
    address_line_2?: string;
    area_name: string;
    pincode: string;
  } | {
    address_line_1: string;
    address_line_2?: string;
    area_name: string;
    pincode: string;
  }[];
  items: {
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }[];
}

// Types
interface OrderAddress {
  address_line_1: string;
  address_line_2?: string;
  area_name: string;
  pincode: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  pickup_date: string;
  pickup_slot: string;
  delivery_date: string;
  delivery_slot: string;
  is_express: boolean;
  total_amount: number;
  status: string; // pending_pickup, picked_up, processing, out_for_delivery, delivered
  address?: OrderAddress;
  items?: OrderItem[];
}

interface DashboardUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    phone?: string;
  };
}

const STATUS_STEPS = [
  { key: "confirmed", label: "Order Received", desc: "We have registered your concierge request." },
  { key: "pending_pickup", label: "Valet Pickup Scheduled", desc: "Our premium concierge is coming to collect your wardrobe." },
  { key: "processing", label: "Couture Cleaning & Care", desc: "Your items are being cleaned using organic soft-water tech." },
  { key: "out_for_delivery", label: "Valet Out for Delivery", desc: "Our delivery concierge is returning your pristine clothes." },
  { key: "delivered", label: "Delivered & Complete", desc: "Delivered back to your doorstep in premium packaging." }
];

export default function Dashboard() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch orders from Supabase or LocalStorage Mock
  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") || user.id.includes("mock");

    if (isMock) {
      // 1. Sandbox Mock Fetch from LocalStorage
      setTimeout(() => {
        const mockOrders: Order[] = JSON.parse(localStorage.getItem("washdoor_mock_orders") || "[]");
        setOrders(mockOrders);
        if (mockOrders.length > 0) {
          setSelectedOrder(mockOrders[mockOrders.length - 1]); // default select latest order
        }
        setLoadingOrders(false);
      }, 1000);
      return;
    }

    // 2. Real Database Fetch from Supabase
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id, pickup_date, pickup_slot, delivery_date, delivery_slot, is_express, total_amount, status,
            address:addresses(address_line_1, address_line_2, area_name, pincode),
            items:order_items(item_id, item_name, price, quantity)
          `)
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Map database response types to our client schema
        const mappedOrders: Order[] = (data as unknown as RawDBOrder[] || []).map((o) => {
          const rawAddress = Array.isArray(o.address) ? o.address[0] : o.address;
          return {
            id: o.id,
            pickup_date: o.pickup_date,
            pickup_slot: o.pickup_slot,
            delivery_date: o.delivery_date,
            delivery_slot: o.delivery_slot,
            is_express: o.is_express,
            total_amount: o.total_amount,
            status: o.status,
            address: rawAddress ? {
              address_line_1: rawAddress.address_line_1,
              address_line_2: rawAddress.address_line_2,
              area_name: rawAddress.area_name,
              pincode: rawAddress.pincode
            } : undefined,
            items: (o.items || []).map((it) => ({
              id: it.item_id,
              name: it.item_name,
              price: it.price,
              quantity: it.quantity
            }))
          };
        });

        setOrders(mappedOrders);
        if (mappedOrders.length > 0) {
          setSelectedOrder(mappedOrders[0]);
        }
      } catch (err) {
        console.error("Failed to load orders from database", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();

    // 3. Setup active Postgres Realtime Channel for Live order tracking updates
    const channel = supabase
      .channel("realtime-orders-dashboard")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `profile_id=eq.${user.id}`
        },
        (payload: { new: { id: string; status: string } }) => {
          const updatedId = payload.new.id;
          const updatedStatus = payload.new.status;
          setOrders((prev) =>
            prev.map((o) => {
              if (o.id === updatedId) {
                const updatedOrder = { ...o, status: updatedStatus };
                setSelectedOrder((prevSelected) => {
                  if (prevSelected && prevSelected.id === o.id) {
                    return updatedOrder;
                  }
                  return prevSelected;
                });
                return updatedOrder;
              }
              return o;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [user]);

  // Auth form submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isMock) {
      setTimeout(() => {
        setUser({
          id: "mock-user-123",
          email: authEmail || "customer@washdoor.in",
          user_metadata: { name: "Premium Client" }
        });
        setAuthLoading(false);
      }, 1000);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({
      id: "mock-demo-id",
      email: "demo@washdoor.in",
      user_metadata: { name: "Valued Customer" }
    });
  };

  const handleSignOut = async () => {
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") || user?.id.includes("mock");
    if (!isMock) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setOrders([]);
    setSelectedOrder(null);
  };

  // Helper to determine active step indexes
  const getStatusIndex = (status: string) => {
    if (status === "pending_pickup") return 1;
    if (status === "picked_up") return 2; // maps to processing start
    if (status === "processing") return 2;
    if (status === "out_for_delivery") return 3;
    if (status === "delivered") return 4;
    return 0; // confirmed default
  };

  return (
    <main className="relative min-h-screen bg-[#0A0F2C] py-24 text-white overflow-hidden font-sans">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00D4AA]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Canvas */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header row */}
        <div className="flex justify-between items-center mb-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="text-right flex items-center gap-6">
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] bg-clip-text text-transparent font-sans">
              WASHCLUB
            </span>
            {user && (
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!user ? (
            // Authentication Gate Screen
            <motion.div
              key="auth-gate"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D4AA] to-[#7C3AED] flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Valet Tracker Login</h2>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Provide your account credentials to view your concierge laundry statuses.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                  />
                </div>

                {authError && (
                  <span className="text-xs font-bold text-red-400 block font-sans">
                    ⚠️ {authError}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] text-sm font-black text-white hover:opacity-90 transition-all"
                >
                  {authLoading ? "Accessing Tracker..." : "Access Valet Dashboard"}
                </button>
              </form>

              <div className="border-t border-white/5 pt-4 mt-6">
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all font-sans"
                >
                  ⚡ Open Demo Sandbox Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            // Full Customer Tracking Panel
            <motion.div
              key="dashboard-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              
              {/* Left Column: Active Valet Orders Lists */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl">
                  <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#00D4AA]" />
                    Your Valet Schedules
                  </h3>

                  {loadingOrders ? (
                    <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2 font-sans">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#00D4AA]" />
                      Loading valet histories...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 font-sans text-xs">
                      No active orders found. Click below to schedule a valet.
                      <Link
                        href="/booking"
                        className="mt-4 block py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] text-xs font-bold text-white shadow-md text-center"
                      >
                        Schedule Valet Pickup
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((o) => {
                        const isSelected = selectedOrder?.id === o.id;
                        return (
                          <div
                            key={o.id}
                            onClick={() => setSelectedOrder(o)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                              isSelected 
                                ? "bg-white/[0.03] border-white/15" 
                                : "bg-transparent border-white/[0.03] hover:border-white/10"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-black text-white font-mono">{o.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-sans uppercase ${
                                o.status === "delivered" 
                                  ? "bg-[#00D4AA]/10 text-[#00D4AA]" 
                                  : "bg-[#7C3AED]/10 text-[#7C3AED]"
                              }`}>
                                {o.status.replace("_", " ")}
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-slate-500 font-sans flex items-center justify-between">
                              <span>Pickup: {o.pickup_date}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column: Live Timeline Tracker Card */}
              <div className="lg:col-span-8">
                {selectedOrder ? (
                  <div className="p-8 md:p-10 rounded-[30px] bg-white/[0.01] border border-white/5 backdrop-blur-2xl relative overflow-hidden">
                    {/* Glowing Blur overlay */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#00D4AA]/5 to-transparent rounded-full pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-white/5 pb-6 mb-8 gap-4">
                      <div>
                        <span className="text-xs font-bold text-[#00D4AA] uppercase tracking-wider block mb-1 font-sans">
                          Valet Status Screen
                        </span>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                          Track Order {selectedOrder.id}
                        </h2>
                      </div>
                      
                      <div className="text-left md:text-right font-sans text-xs">
                        <span className="text-slate-500 block mb-0.5">Grand Total Quote</span>
                        <span className="text-xl font-black text-[#00D4AA] font-mono">₹{selectedOrder.total_amount}</span>
                      </div>
                    </div>

                    {/* Highly Interactive Vertical Timeline */}
                    <div className="relative pl-8 space-y-10 border-l border-white/10 ml-3">
                      {STATUS_STEPS.map((stepItem, idx) => {
                        const activeIdx = getStatusIndex(selectedOrder.status);
                        const isCompleted = idx < activeIdx || selectedOrder.status === "delivered";
                        const isCurrent = idx === activeIdx && selectedOrder.status !== "delivered";

                        return (
                          <div key={idx} className="relative">
                            
                            {/* Dot indicator */}
                            <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 ${
                              isCompleted 
                                ? "bg-[#00D4AA] border-[#00D4AA] text-[#0A0F2C] shadow-[0_0_12px_rgba(0,212,170,0.4)]"
                                : isCurrent
                                ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)] animate-pulse"
                                : "bg-[#0A0F2C] border-white/20 text-slate-500"
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                              ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-slate-700"}`} />
                              )}
                            </div>

                            {/* Text labels */}
                            <div>
                              <h4 className={`text-base font-extrabold transition-colors ${
                                isCompleted || isCurrent ? "text-white" : "text-slate-500"
                              }`}>
                                {stepItem.label}
                              </h4>
                              <p className={`text-xs font-sans font-medium mt-1 transition-colors leading-relaxed ${
                                isCompleted || isCurrent ? "text-slate-400" : "text-slate-600"
                              }`}>
                                {stepItem.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Schedule and Valet parameters details shelf */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 border-t border-white/5 pt-8 font-sans text-xs font-semibold text-slate-400">
                      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                        <span className="text-slate-500 uppercase tracking-widest text-[10px] block font-bold"> valets Schedule</span>
                        <div className="flex justify-between">
                          <span>Pickup Time:</span>
                          <span className="text-white text-right">{selectedOrder.pickup_date} <br/> ({selectedOrder.pickup_slot})</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                          <span>Delivery Promised:</span>
                          <span className="text-white text-right">{selectedOrder.delivery_date} <br/> ({selectedOrder.delivery_slot})</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                        <span className="text-slate-500 uppercase tracking-widest text-[10px] block font-bold">Drop-Off Destination</span>
                        <div className="flex justify-between">
                          <span>Concierge Address:</span>
                          <span className="text-white text-right truncate max-w-[150px]" title={selectedOrder.address?.address_line_1}>
                            {selectedOrder.address?.address_line_1}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                          <span>Hyderabad Zone:</span>
                          <span className="text-[#00D4AA] font-bold text-right">{selectedOrder.address?.area_name}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-96 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl flex items-center justify-center text-slate-500 font-sans text-sm">
                    Select an order from the list on the left to view active tracking.
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
