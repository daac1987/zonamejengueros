import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/src/components/Footer";
import { Toaster } from "sonner";

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
        {children}
        <Toaster position="top-center" theme="dark" richColors />
        <Footer />
      </body>
    </html>
  );
}
