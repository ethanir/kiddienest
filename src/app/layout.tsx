import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareLoop — Daycare updates made simple",
  description:
    "CareLoop helps daycare staff and parents stay connected through check-ins, daily reports, photos, messages, forms, and incident reports — in one simple, secure place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
