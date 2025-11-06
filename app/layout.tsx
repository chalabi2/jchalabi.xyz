import type { Metadata } from "next";
import { defaultMeta } from "@/lib/seo";

import "./globals.css";
import "./prism.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/nav-bar";
import PageTransition from "@/components/page-transition";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL(defaultMeta.url),
  title: {
    default: defaultMeta.title,
    template: "%s | " + defaultMeta.title,
  },
  description: defaultMeta.description,
  keywords: defaultMeta.keywords,
  openGraph: {
    type: "website",
    url: defaultMeta.url,
    siteName: defaultMeta.siteName,
    title: defaultMeta.title,
    description: defaultMeta.description,
    images: [
      {
        url: defaultMeta.ogImagePath,
        width: 1200,
        height: 630,
        alt: defaultMeta.title,
      },
    ],
    locale: defaultMeta.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMeta.title,
    description: defaultMeta.description,
    images: [defaultMeta.ogImagePath],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
