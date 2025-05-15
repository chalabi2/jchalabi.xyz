import type { Metadata } from "next";

import "./globals.css";
import "./prism.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/nav-bar";
import PageTransition from "@/components/page-transition";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Joseph Chalabi | Portfolio",
  description: "Portfolio website showcasing my projects and skills",
};

const berkleyMono = localFont({
  src: [
    {
      path: "../public/fonts/berkley-mono/BerkeleyMono-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/berkley-mono/BerkeleyMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/berkley-mono/BerkeleyMono-Oblique.woff2",
      weight: "500",
      style: "oblique",
    },
    {
      path: "../public/fonts/berkley-mono/BerkeleyMono-Bold-Oblique.woff2",
      weight: "700",
      style: "oblique",
    },
  ],
  variable: "--font-berkley-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${berkleyMono.className}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <PageTransition>{children}</PageTransition>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
