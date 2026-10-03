import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import Header from "@/components/Header";
import { SITE } from "@/lib/config";

const body = Public_Sans({ subsets: ["latin"], variable: "--font-body" });
const head = Source_Serif_4({ subsets: ["latin"], variable: "--font-head" });

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.tagline,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f5b4a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${head.variable}`}>
      <body>
        <Header />
        <main className="mx-auto w-full max-w-2xl px-3 pb-24 pt-5 sm:px-4 sm:pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
