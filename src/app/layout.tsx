import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/src/components/Footer";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { BannerBienvenida } from "@/src/components/BannerBienvenida";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mejengueros",
  description: "Busca retos, canchas y campeonatos de fútbol amateur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a]">
        <div className="fixed inset-0 bg-glow pointer-events-none" />
        <Navbar />
        <BannerBienvenida />
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster position="top-center" theme="dark" richColors />
        <Footer />
      </body>
    </html>
  );
}
