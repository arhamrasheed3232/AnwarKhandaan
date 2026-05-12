import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import AudioPlayer from "@/components/audio/AudioPlayer";
import ParticleCanvas from "@/components/layout/ParticleCanvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
};

export const metadata: Metadata = {
  title: "Anwar Khandaan - The Legacy Continues",
  description: "A premium Anwar Khandaan (Family Legacy) website.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Khandaan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ParticleCanvas />
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow pt-16 md:pt-24">
            {children}
          </main>
          <Footer />
          <AudioPlayer />
        </SmoothScroll>
      </body>
    </html>
  );
}
