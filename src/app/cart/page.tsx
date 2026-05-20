"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [orders, setOrders] = useState<any[]>([]);

  // Pull mock orders that the sandbox booking flow stores in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("washclub_mock_orders");
      if (stored) {
        try {
          setOrders(JSON.parse(stored));
        } catch {
          setOrders([]);
        }
      }
    }
  }, []);

  if (orders.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A0F2C] text-white px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Bag is Empty</h1>
          <p className="mb-6">Add items in the booking flow to see them here.</p>
          <Link
            href="/booking"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#7C3AED] font-bold transition-all hover:scale-105 inline-block"
          >
            Start Booking
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Your Bag</h1>
      <div className="space-y-6">
        {orders.map((order, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="font-mono text-sm mb-2">Order #: {order.id}</p>
            <p className="text-sm mb-2">Pickup: {order.pickup_date} ({order.pickup_slot})</p>
            <p className="text-sm mb-2">Delivery: {order.delivery_date} ({order.delivery_slot})</p>
            <p className="text-sm font-bold">Total: ₹{order.total_amount}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
