import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AquaThar — Groundwater Intelligence System",
  description:
    "Explore estimated groundwater availability and depth across Tharparkar, Sindh, Pakistan. Interactive map, location analysis and an environmental dashboard. Sample prototype data — requires field verification.",
  keywords: [
    "AquaThar",
    "Tharparkar",
    "groundwater",
    "Sindh",
    "water",
    "hydrogeology",
    "Pakistan",
  ],
  authors: [{ name: "AquaThar Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AquaThar — Groundwater Intelligence System",
    description:
      "Explore estimated groundwater availability across Tharparkar, Sindh, Pakistan.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AquaThar — Groundwater Intelligence",
    description:
      "Explore estimated groundwater availability across Tharparkar, Sindh, Pakistan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
