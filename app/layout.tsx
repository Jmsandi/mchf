import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mchf-health-foundation.salty-tick-4448.chatgpt.site"),
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
