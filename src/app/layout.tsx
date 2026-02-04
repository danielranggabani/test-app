import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MasWebsite.id CRM",
  description: "AI CRM & Scheduling Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(inter.className, "antialiased bg-background text-foreground")}
      >
        <Providers>
           {children}
        </Providers>
      </body>
    </html>
  );
}
