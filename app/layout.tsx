import type { Metadata } from "next";
import "./globals.css";
import "./site-polish.css";
import VisitorTracker from "@/components/site/visitor-tracker";
import {siteUrl} from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  alternates: { canonical: "/" },
  openGraph: {type: "website", title: "MCHF | Maternal and Child Health Foundation | Sierra Leone", description: "Every mother. Every newborn. Every community in Sierra Leone."},
  title: "MCHF | Maternal and Child Health Foundation | Sierra Leone",
  description: "Maternal and Child Health Foundation advances equitable, evidence-based health in Sierra Leone through community action, research and stronger health systems.",
  other: {
    
  },
  icons: {
    icon: { url: "/images/mchf-logo.png", type: "image/png" },
    shortcut: "/images/mchf-logo.png",
    apple: "/images/mchf-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="stylesheet" href="/fonts/fonts.css"/></head>
      <body className="antialiased">{children}<VisitorTracker/></body>
    </html>
  );
}
