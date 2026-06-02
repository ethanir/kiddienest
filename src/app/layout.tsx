import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/careloop/pwa-register";

export const metadata: Metadata = {
  applicationName: "KiddieNest",
  title: "KiddieNest — Daycare updates made simple",
  description:
    "KiddieNest helps daycare staff and parents stay connected through check-ins, daily reports, photos, messages, forms, and incident reports — in one simple, secure place.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "KiddieNest",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before the page paints so the correct theme is applied with no flash.
const themeScript = `
try {
  var t = localStorage.getItem('careloop-theme');
  var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
