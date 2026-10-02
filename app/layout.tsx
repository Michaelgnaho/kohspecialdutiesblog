import "./globals.css";
import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import Header from "@/components/Header";
import { SITE } from "@/lib/config";

const body = Public_Sans({ subsets: ["latin"], variable: "--font-body" });
const head = Source_Serif_4({ subsets: ["latin"], variable: "--font-head" });

export const metadata: Metadata = { title: SITE.name, description: SITE.tagline };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${head.variable}`}>
      <body>
        <Header />
        <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
