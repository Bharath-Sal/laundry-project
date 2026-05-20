"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, ShoppingBag, MapPin, 
  CheckCircle2, Plus, Minus, Calendar, Percent, 
  Lock, Mail, User, Phone, CheckCircle, Clock
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Types
interface BookingItem {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
}

interface BookingUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    phone?: string;
  };
}

const ITEMS_DB: BookingItem[] = [
  { id: "shirt", name: "Premium Cotton Shirt", price: 90, category: "Apparel", unit: "piece" },
  { id: "suit", name: "Executive 2-Piece Suit", price: 450, category: "Couture", unit: "set" },
  { id: "saree", name: "Heavy Silk Saree / Lehenga", price: 380, category: "Couture", unit: "piece" },
  { id: "pants", name: "Formal / Casual Trousers", price: 90, category: "Apparel", unit: "piece" },
  { id: "sneakers", name: "Luxury Sneaker Restore", price: 950, category: "Leather & Sneaker", unit: "pair" },
  { id: "jacket", name: "Designer Bomber/Leather Jacket", price: 1200, category: "Leather & Sneaker", unit: "piece" },
  { id: "press", name: "Steam Ironing - Executive Suit", price: 120, category: "Premium Pressing", unit: "piece" }
];

const TIME_SLOTS = [
  "07:00 AM - 09:00 AM",
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "03:00 PM - 05:00 PM",
  "05:00 PM - 07:00 PM",
  "07:00 PM - 09:00 PM"
];

const VALID_PINCODES: Record<string, string> = {
  "500033": "Jubilee Hills",
  "500034": "Banjara Hills",
  "500081": "Hitec City / Madhapur",
  "500032": "Gachibowli",
  "500084": "Kondapur",
  "500008": "Mehdipatnam / Tolichowki"
};

// Slide transition variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export default function Booking() {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = backward

  // User Auth States
  const [user, setUser] = useState<BookingUser | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Booking Flow States
  const [bag, setBag] = useState<Record<string, number>>({});
  const [pickupDate, setPickupDate] = useState<string>("");
  const [pickupSlot, setPickupSlot] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliverySlot, setDeliverySlot] = useState<string>("");
  const [expressDelivery, setExpressDelivery] = useState<boolean>(false);

  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [areaName, setAreaName] = useState<string>("");
  const [pincodeError, setPincodeError] = useState<string>("");

  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<boolean>(false);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>("");

  // Final Order Placed Success States
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Auth State Listener
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Authentication
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isMock) {
      // Mock Authentication Sandbox
      setTimeout(() => {
        const mockUser = {
          id: "mock-user-uuid-12345",
          email: authEmail || "customer@washdoor.in",
          user_metadata: {
            name: authName || "Valued Guest",
            phone: authPhone || "9999999999"
          }
        };
        setUser(mockUser);
        setAuthLoading(false);
      }, 1000);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up with metadata fields
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              name: authName,
              phone: authPhone
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
        }
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An authentication error occurred.";
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Social Authentication
  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setAuthError("");
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
    
    if (isMock) {
      // Bypassing auth for testing sandbox
      handleGuestMockLogin();
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + '/booking'
        }
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to authenticate with ${provider}.`;
      setAuthError(message);
    }
  };

  // Bypassing auth for testing sandbox
  const handleGuestMockLogin = () => {
    setUser({
      id: "mock-guest-id",
      email: "guest@washdoor.in",
      user_metadata: {
        name: "Premium Guest",
        phone: "+91 99999 88888"
      }
    });
  };

  const handleSignOut = async () => {
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
    if (!isMock) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  // Helpers for navigation
  const nextStep = () => {
    if (step < 4) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  // Bag Quantities
  const incrementBag = (id: string) => {
    setBag((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementBag = (id: string) => {
    setBag((prev) => {
      const updated = { ...prev };
      if (updated[id] <= 1) {
        delete updated[id];
      } else {
        updated[id] -= 1;
      }
      return updated;
    });
  };

  // Pincode validation
  const handlePincodeChange = (val: string) => {
    setPincode(val);
    if (val.length === 6) {
      const matchedArea = VALID_PINCODES[val];
      if (matchedArea) {
        setAreaName(matchedArea);
        setPincodeError("");
      } else {
        setAreaName("");
        setPincodeError("We currently do not service this pincode in Hyderabad.");
      }
    } else {
      setAreaName("");
      setPincodeError("");
    }
  };

  // Promo code validation
  const applyPromoCode = () => {
    if (promoCode.trim().toUpperCase() === "HYDGLOW") {
      setAppliedPromo(true);
      setPromoDiscount(0.10); // 10% discount
      setPromoError("");
    } else {
      setAppliedPromo(false);
      setPromoDiscount(0);
      setPromoError("Invalid promotional code.");
    }
  };

  // Dynamic calculations
  const totals = useMemo(() => {
    let subtotal = 0;
    let totalItems = 0;

    Object.entries(bag).forEach(([itemId, qty]) => {
      const dbItem = ITEMS_DB.find((i) => i.id === itemId);
      if (dbItem) {
        subtotal += dbItem.price * qty;
        totalItems += qty;
      }
    });

    if (expressDelivery && subtotal > 0) {
      subtotal = subtotal * 1.5;
    }

    const discountAmount = subtotal * promoDiscount;
    const discountedSubtotal = subtotal - discountAmount;
    const cgst = discountedSubtotal * 0.09;
    const sgst = discountedSubtotal * 0.09;
    const total = discountedSubtotal + cgst + sgst;

    return {
      subtotal: Math.round(subtotal),
      totalItems,
      discountAmount: Math.round(discountAmount),
      cgst: Math.round(cgst),
      sgst: Math.round(sgst),
      total: Math.round(total)
    };
  }, [bag, expressDelivery, promoDiscount]);

  // Step Validation checks
  const isStepValid = useMemo(() => {
    if (step === 1) return totals.totalItems > 0;
    if (step === 2) return Boolean(pickupDate && pickupSlot && deliveryDate && deliverySlot);
    if (step === 3) return Boolean(addressLine1 && pincode.length === 6 && areaName && !pincodeError);
    return true;
  }, [step, totals.totalItems, pickupDate, pickupSlot, deliveryDate, deliverySlot, addressLine1, pincode, areaName, pincodeError]);

  // Submit Concierge Order to Database
  const submitConciergeOrder = async () => {
    if (!user) return;
    setSubmitLoading(true);
    setSubmitError("");

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    // 1. Sandbox Mock Order Submission
    if (isMock) {
      setTimeout(() => {
        const orderId = `WC-HYD-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Persist mock order locally in localStorage for Dashboard listing
        const mockOrder = {
          id: orderId,
          pickup_date: pickupDate,
          pickup_slot: pickupSlot,
          delivery_date: deliveryDate,
          delivery_slot: deliverySlot,
          is_express: expressDelivery,
          total_amount: totals.total,
          status: "pending_pickup",
          address: {
            address_line_1: addressLine1,
            address_line_2: addressLine2,
            area_name: areaName,
            pincode
          },
          items: Object.entries(bag).map(([itemId, qty]) => {
            const item = ITEMS_DB.find((i) => i.id === itemId);
            return {
              id: itemId,
              name: item?.name || itemId,
              price: item?.price || 0,
              quantity: qty
            };
          })
        };

        const existingOrders = JSON.parse(localStorage.getItem("washdoor_mock_orders") || "[]");
        existingOrders.push(mockOrder);
        localStorage.setItem("washdoor_mock_orders", JSON.stringify(existingOrders));

        setPlacedOrderId(orderId);
        setBookingConfirmed(true);
        setSubmitLoading(false);
      }, 1500);
      return;
    }

    // 2. Real Database Order Submission
    try {
      // Step A: Insert address to database
      const { data: addrData, error: addrError } = await supabase
        .from("addresses")
        .insert({
          profile_id: user.id,
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          landmark,
          pincode,
          area_name: areaName
        })
        .select()
        .single();

      if (addrError) throw addrError;

      // Step B: Insert main order details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          profile_id: user.id,
          address_id: addrData.id,
          pickup_date: pickupDate,
          pickup_slot: pickupSlot,
          delivery_date: deliveryDate,
          delivery_slot: deliverySlot,
          is_express: expressDelivery,
          subtotal: totals.subtotal,
          discount_amount: totals.discountAmount,
          total_amount: totals.total,
          status: "pending_pickup"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Step C: Insert order items
      const itemsToInsert = Object.entries(bag).map(([itemId, qty]) => {
        const dbItem = ITEMS_DB.find((i) => i.id === itemId);
        return {
          order_id: orderData.id,
          item_id: itemId,
          item_name: dbItem?.name || itemId,
          price: dbItem?.price || 0,
          quantity: qty
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      setPlacedOrderId(orderData.id);
      setBookingConfirmed(true);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit database transactions.";
      setSubmitError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0A0F2C] py-24 text-white overflow-hidden font-sans">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00D4AA]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Canvas */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header row */}
        <div className="flex justify-between items-center mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="text-right">
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] bg-clip-text text-transparent">
              WASHDOOR
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!bookingConfirmed ? (
            <motion.div
              key="booking-form-wrapper"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stepper Progress bar */}
              <div className="mb-12">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  <span className={step >= 1 ? "text-[#00D4AA]" : ""}>1. Customize Bag</span>
                  <span className={step >= 2 ? "text-[#00D4AA]" : ""}>2. Schedule</span>
                  <span className={step >= 3 ? "text-[#00D4AA]" : ""}>3. Location</span>
                  <span className={step >= 4 ? "text-[#00D4AA]" : ""}>4. Review</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full relative overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00D4AA] to-[#7C3AED]"
                    initial={{ width: "25%" }}
                    animate={{ width: `${step * 25}%` }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Main interactive sliding window */}
              <div className="relative min-h-[500px]">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full"
                  >
                    
                    {/* STEP 1: ITEM CUSTOMIZER */}
                    {step === 1 && (
                      <div className="p-8 md:p-10 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl">
                        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                          <ShoppingBag className="w-6 h-6 text-[#00D4AA]" />
                          Customize Your Cleanse Bag
                        </h2>
                        <p className="text-sm text-slate-500 mb-8 font-medium">
                          Select the quantities of clothes you want picked up. You can adjust this later during pick-up.
                        </p>

                        <div className="space-y-4">
                          {ITEMS_DB.map((item) => {
                            const qty = bag[item.id] || 0;
                            return (
                              <div
                                key={item.id}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                  qty > 0 ? "bg-white/[0.02] border-white/10" : "bg-transparent border-white/[0.03]"
                                }`}
                              >
                                <div>
                                  <span className="text-xs font-bold text-[#00D4AA] uppercase tracking-wide block mb-1 font-sans">
                                    {item.category}
                                  </span>
                                  <h4 className="text-base font-bold text-white mb-0.5">{item.name}</h4>
                                  <span className="text-xs font-semibold text-slate-500 font-sans">
                                    ₹{item.price} / {item.unit}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4">
                                  {qty > 0 ? (
                                    <div className="flex items-center gap-3.5 bg-[#0A0F2C]/80 p-1.5 rounded-xl border border-white/5">
                                      <button
                                        onClick={() => decrementBag(item.id)}
                                        className="p-1 rounded-lg bg-white/5 hover:bg-[#7C3AED]/20 text-slate-300 transition-colors"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="text-sm font-black text-white w-6 text-center font-mono">{qty}</span>
                                      <button
                                        onClick={() => incrementBag(item.id)}
                                        className="p-1 rounded-lg bg-white/5 hover:bg-[#00D4AA]/20 text-slate-300 transition-colors"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => incrementBag(item.id)}
                                      className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-[#00D4AA] border border-white/[0.05] hover:border-[#00D4AA] text-xs font-bold text-white transition-all scale-100 hover:scale-[1.04]"
                                    >
                                      Add to bag
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 2: OPERATIONAL SCHEDULER */}
                    {step === 2 && (
                      <div className="p-8 md:p-10 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl">
                        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                          <Calendar className="w-6 h-6 text-[#00D4AA]" />
                          Schedule Pickup & Delivery
                        </h2>
                        <p className="text-sm text-slate-500 mb-8 font-medium">
                          Choose dates and premium time windows for our concierge valet.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          {/* Pickup configuration */}
                          <div className="space-y-5">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                              <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                              Concierge Pickup
                            </h3>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Pickup Date</label>
                              <input
                                type="date"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Time Slot</label>
                              <select
                                value={pickupSlot}
                                onChange={(e) => setPickupSlot(e.target.value)}
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                              >
                                <option value="">Select Time Slot</option>
                                {TIME_SLOTS.map((s, idx) => (
                                  <option key={idx} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Delivery configuration */}
                          <div className="space-y-5">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                              Concierge Delivery
                            </h3>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Delivery Date</label>
                              <input
                                type="date"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Time Slot</label>
                              <select
                                value={deliverySlot}
                                onChange={(e) => setDeliverySlot(e.target.value)}
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                              >
                                <option value="">Select Time Slot</option>
                                {TIME_SLOTS.map((s, idx) => (
                                  <option key={idx} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                        </div>

                        {/* Delivery Upgrade speed */}
                        <div
                          onClick={() => setExpressDelivery(!expressDelivery)}
                          className={`mt-8 flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            expressDelivery ? "bg-[#7C3AED]/10 border-[#7C3AED]" : "bg-transparent border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div>
                            <h4 className="text-sm font-bold text-white mb-0.5">⚡ Upgrade to Express Care (24-Hour Return)</h4>
                            <p className="text-xs text-slate-500 font-sans font-medium">
                              Cuts standard turnaround times in half. Adds a 50% premium to final garment processing costs.
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            expressDelivery ? "bg-[#7C3AED] border-[#7C3AED]" : "border-white/20"
                          }`}>
                            {expressDelivery && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: DYNAMIC LOCATION GATE */}
                    {step === 3 && (
                      <div className="p-8 md:p-10 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl">
                        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                          <MapPin className="w-6 h-6 text-[#00D4AA]" />
                          Concierge Address Details
                        </h2>
                        <p className="text-sm text-slate-500 mb-8 font-medium">
                          We currently service elite communities in Jubilee Hills, Banjara Hills, Gachibowli, and Hitec City.
                        </p>

                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Flat / Villa / House Number & Street</label>
                              <input
                                type="text"
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                                placeholder="e.g. Villa 12, Road No 4"
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Community Name / Area</label>
                              <input
                                type="text"
                                value={addressLine2}
                                onChange={(e) => setAddressLine2(e.target.value)}
                                placeholder="e.g. Jubilee Crest Apartments"
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Pin Code (Hyderabad)</label>
                              <input
                                type="text"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => handlePincodeChange(e.target.value)}
                                placeholder="e.g. 500033"
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 font-sans uppercase">Landmark</label>
                              <input
                                type="text"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                                placeholder="e.g. Near Jubilee Hills Check Post"
                                className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                              />
                            </div>
                          </div>

                          {areaName && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-xl bg-[#00D4AA]/5 border border-[#00D4AA]/20 text-[#00D4AA] text-xs font-bold tracking-wide"
                            >
                              ✓ Verified Coverage: We have active dry-cleaning logistics in {areaName}!
                            </motion.div>
                          )}

                          {pincodeError && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-bold tracking-wide"
                            >
                              ⚠️ {pincodeError}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 4: REVIEW & CONFIRM */}
                    {step === 4 && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Summary Columns */}
                        <div className="lg:col-span-7 space-y-6">
                          <div className="p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
                              Booking Parameters Review
                            </h3>
                            
                            <div className="space-y-5 font-sans text-sm font-semibold text-slate-400">
                              {/* Pickup detail */}
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Valet Pickup</span>
                                <span className="text-white">{pickupDate}</span>
                                <span className="text-slate-500 text-xs ml-2">({pickupSlot})</span>
                              </div>

                              {/* Delivery detail */}
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Valet Return</span>
                                <span className="text-white">{deliveryDate}</span>
                                <span className="text-slate-500 text-xs ml-2">({deliverySlot})</span>
                              </div>

                              {/* Address detail */}
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Delivery Address</span>
                                <span className="text-white block">{addressLine1}, {addressLine2}</span>
                                <span className="text-xs text-[#00D4AA] font-bold block mt-1">{areaName} - {pincode}</span>
                              </div>
                            </div>
                          </div>

                          {/* Promo Code entry box */}
                          <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl">
                            <div className="flex gap-4">
                              <div className="relative flex-grow">
                                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                  type="text"
                                  value={promoCode}
                                  onChange={(e) => setPromoCode(e.target.value)}
                                  placeholder="Try code: HYDGLOW"
                                  disabled={appliedPromo}
                                  className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA]"
                                />
                              </div>
                              <button
                                onClick={applyPromoCode}
                                disabled={appliedPromo}
                                className="px-6 py-3 rounded-xl bg-white/[0.03] hover:bg-[#00D4AA] border border-white/10 hover:border-[#00D4AA] text-sm font-bold text-white transition-all disabled:opacity-50"
                              >
                                {appliedPromo ? "Applied" : "Apply"}
                              </button>
                            </div>
                            {promoError && <span className="text-xs font-semibold text-red-400 mt-2 block font-sans">{promoError}</span>}
                            {appliedPromo && <span className="text-xs font-bold text-[#00D4AA] mt-2 block font-sans">✓ Code applied: 10% premium discount awarded!</span>}
                          </div>
                        </div>

                        {/* Right Section: Auth Drawer or Financial Ledger */}
                        <div className="lg:col-span-5 relative">
                          
                          {!user ? (
                            // Interactive Auth Drawer
                            <div className="relative p-6 md:p-8 rounded-[30px] bg-[#0E153A] border border-white/10 shadow-[0_0_40px_rgba(0,212,170,0.05)]">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 rounded-full blur-2xl pointer-events-none" />
                              
                              <h3 className="text-base font-extrabold text-white mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-[#00D4AA]" />
                                Secure Checkout
                              </h3>
                              <p className="text-xs text-slate-400 font-sans font-medium mb-6">
                                Sign up or sign in to complete your valet schedule reservation.
                              </p>

                              <form onSubmit={handleAuthSubmit} className="space-y-4">
                                {isSignUp && (
                                  <>
                                    <div className="relative">
                                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                      <input
                                        type="text"
                                        required
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D4AA]"
                                      />
                                    </div>
                                    <div className="relative">
                                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                      <input
                                        type="tel"
                                        required
                                        value={authPhone}
                                        onChange={(e) => setAuthPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D4AA]"
                                      />
                                    </div>
                                  </>
                                )}

                                <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                  <input
                                    type="email"
                                    required
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D4AA]"
                                  />
                                </div>

                                <div className="relative">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                  <input
                                    type="password"
                                    required
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    placeholder="Secure Password"
                                    className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D4AA]"
                                  />
                                </div>

                                {authError && (
                                  <span className="text-[11px] font-bold text-red-400 block font-sans">
                                    ⚠️ {authError}
                                  </span>
                                )}

                                <button
                                  type="submit"
                                  disabled={authLoading}
                                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] text-xs font-black text-white hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                  {authLoading ? "Authenticating..." : isSignUp ? "Create Heritage Account" : "Access Account"}
                                </button>
                              </form>

                              <div className="mt-4 flex items-center justify-center gap-2">
                                <div className="h-px bg-white/10 w-full" />
                                <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap px-2">Or continue with</span>
                                <div className="h-px bg-white/10 w-full" />
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-4">
                                <button
                                  type="button"
                                  onClick={() => handleOAuthLogin('google')}
                                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/5 text-xs font-bold text-white transition-all"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                  </svg>
                                  Google
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOAuthLogin('facebook')}
                                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-xs font-bold text-[#1877F2] transition-all"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                  Facebook
                                </button>
                              </div>

                              <div className="mt-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => setIsSignUp(!isSignUp)}
                                  className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors font-sans"
                                >
                                  {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                                </button>
                              </div>

                              <div className="border-t border-white/5 pt-4 mt-6">
                                <button
                                  type="button"
                                  onClick={handleGuestMockLogin}
                                  className="w-full py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all"
                                >
                                  ⚡ Test Drive Sandbox (Skip Auth)
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Financial Ledger & Confirm Booking button
                            <div className="relative">
                              <div className="absolute -inset-1.5 rounded-[36px] bg-gradient-to-r from-[#00D4AA]/20 to-[#7C3AED]/20 blur-[6px] opacity-75 pointer-events-none" />
                              
                              <div className="relative p-6 md:p-8 rounded-[30px] bg-[#0E153A] border border-white/10 min-h-[380px] flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                                    <h3 className="text-base font-extrabold text-white">
                                      Financial Ledger
                                    </h3>
                                    <div className="text-[10px] text-[#00D4AA] font-bold font-sans">
                                      {user.email}
                                    </div>
                                  </div>

                                  <div className="space-y-3 font-sans text-xs font-semibold text-slate-400">
                                    <div className="flex justify-between">
                                      <span>Subtotal ({totals.totalItems} items)</span>
                                      <span className="text-white font-mono">₹{totals.subtotal}</span>
                                    </div>
                                    {appliedPromo && (
                                      <div className="flex justify-between text-[#00D4AA]">
                                        <span>Promotional Discount (10%)</span>
                                        <span className="font-mono">-₹{totals.discountAmount}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Central GST (9%)</span>
                                      <span className="text-white font-mono">₹{totals.cgst}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>State GST (9%)</span>
                                      <span className="text-white font-mono">₹{totals.sgst}</span>
                                    </div>
                                    
                                    {expressDelivery && (
                                      <div className="text-[10px] text-[#7C3AED] font-bold mt-2">
                                        ⚡ 24h Express Turnaround active
                                      </div>
                                    )}
                                  </div>

                                  <div className="border-t border-white/5 pt-5 mt-6 flex justify-between items-baseline">
                                    <span className="text-sm font-extrabold text-white">Grand Total</span>
                                    <span className="text-3xl font-black text-white font-mono">₹{totals.total}</span>
                                  </div>
                                </div>

                                <div className="space-y-4 mt-8">
                                  {submitError && (
                                    <span className="text-xs font-semibold text-red-400 block font-sans">
                                      ⚠️ {submitError}
                                    </span>
                                  )}

                                  <button
                                    onClick={submitConciergeOrder}
                                    disabled={submitLoading}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] text-sm font-black text-white shadow-[0_0_20px_rgba(0,212,170,0.1)] hover:shadow-[0_0_30px_rgba(0,212,170,0.25)] scale-100 hover:scale-[1.01] transition-all disabled:opacity-50"
                                  >
                                    {submitLoading ? "Transacting order..." : "Confirm Booking"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-400 transition-colors uppercase tracking-widest font-sans"
                                  >
                                    Sign Out of {user.user_metadata?.name || "Profile"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                        
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dynamic Controls Bottom row */}
              <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-8 relative z-50">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="px-6 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm font-bold text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  Previous
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                    disabled={!isStepValid}
                    className={`px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-bold text-white transition-all scale-100 hover:scale-[1.02] ${
                      isStepValid
                        ? "bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] shadow-[0_0_15px_rgba(0,212,170,0.15)]"
                        : "bg-white/[0.01] border border-white/5 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {step === 1 ? "Proceed to Schedule" : step === 2 ? "Proceed to Location" : "Review & Checkout"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </motion.div>
          ) : (
            // SPECTACULAR ORDER SUCCESS SCREEN
            <motion.div
              key="order-success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-xl mx-auto text-center py-12"
            >
              <div className="relative inline-block mb-8">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full bg-[#00D4AA]/20 blur-[10px] scale-150 animate-pulse pointer-events-none" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#7C3AED] flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(0,212,170,0.3)]">
                  <CheckCircle className="w-12 h-12" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Booking{" "}
                <span className="bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] bg-clip-text text-transparent">
                  Confirmed
                </span>
              </h2>

              <p className="text-sm font-medium text-slate-400 font-sans max-w-sm mx-auto mb-8 leading-relaxed">
                Thank you for choosing WashDoor. Our premium concierge valet will pick up your wardrobe items at the designated schedule.
              </p>

              {/* Invoice details sheet */}
              <div className="p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl text-left mb-10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans">Valet Ticket</span>
                  <span className="text-xs font-black text-[#00D4AA] font-mono">{placedOrderId}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans text-xs font-semibold text-slate-400">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Pickup Scheduled</span>
                    <span className="text-white font-medium">{pickupDate}</span>
                    <span className="text-[10px] text-slate-500 block">{pickupSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Return Promised</span>
                    <span className="text-white font-medium">{deliveryDate}</span>
                    <span className="text-[10px] text-slate-500 block">{deliverySlot}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs font-bold font-sans">
                  <span className="text-slate-500">Valet Address</span>
                  <span className="text-white text-right truncate max-w-[200px]">{addressLine1}, {areaName}</span>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-baseline font-sans">
                  <span className="text-xs font-bold text-slate-500">Total Charged</span>
                  <span className="text-lg font-black text-[#00D4AA] font-mono">₹{totals.total}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] text-sm font-black text-white shadow-[0_0_20px_rgba(0,212,170,0.15)] hover:shadow-[0_0_30px_rgba(0,212,170,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Access Live Valet Tracker
                </Link>
                
                <Link
                  href="/"
                  className="inline-block text-xs font-bold text-slate-500 hover:text-white transition-colors font-sans uppercase tracking-widest"
                >
                  Return to Landing Page
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
