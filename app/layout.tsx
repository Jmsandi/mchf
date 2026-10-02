import type { Metadata } from "next";
import "./globals.css";
import VisitorTracker from "@/components/site/visitor-tracker";
import {siteUrl} from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  alternates: { canonical: "/" },
  openGraph: {type: "website", title: "Maternal and Child Health Foundation", description: "Every mother. Every newborn. Every community."},
  title: "MCHF | Every mother. Every newborn. Every community.",
  description: "Maternal and Child Health Foundation advances equitable, evidence-based health in Sierra Leone through community action, research and stronger health systems.",
  other: {
    
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
