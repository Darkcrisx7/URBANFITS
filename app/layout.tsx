import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MainWrapper } from "@/components/layout/main-wrapper";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

const geist = Geist({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://urbanfits.store"),
  title: {
    default: "Urban Fits Streetwear — Look Good. Stay Ahead.",
    template: "%s · Urban Fits",
  },
  description:
    "Urban Fits Streetwear — trendy, comfortable, stylish. Oversized tees, heavyweight hoodies, sneakers, and accessories.",
  openGraph: {
    title: "Urban Fits Streetwear — Look Good. Stay Ahead.",
    description: "Trendy. Comfort. Style.",
    url: "https://urbanfits.store",
    siteName: "Urban Fits",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Fits Streetwear — Look Good. Stay Ahead.",
    description: "Trendy. Comfort. Style.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} ${geistMono.variable}`}>
      <body className="font-body antialiased">
        <Providers>
          <Header />
          <MainWrapper>{children}</MainWrapper>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
