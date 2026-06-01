import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KiddieNest — Daycare updates made simple",
  description:
    "KiddieNest helps daycare staff and parents stay connected through check-ins, daily reports, photos, messages, forms, and incident reports — in one simple, secure place.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
