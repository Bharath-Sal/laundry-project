import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

// Initialize local Geist fonts and map them to standard Tailwind CSS variables
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WashDoor | Luxury Laundry & Dry Cleaning Hyderabad",
  description: "Experience premium fabric care, organic dry cleaning, and 24-hour turnaround in Banjara Hills, Gachibowli, Kondapur, and Hitech City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", geistSans.variable, geistMono.variable)}>
      <body className="bg-[#0A0F2C] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
