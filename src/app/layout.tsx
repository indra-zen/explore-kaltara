import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Explore Kaltara - Jelajahi Keajaiban Kalimantan Utara",
  description: "Platform terdepan untuk menjelajahi destinasi wisata dan hotel terbaik di Kalimantan Utara. Temukan pesona alam liar, budaya Dayak yang kaya, dan pengalaman tak terlupakan di ujung utara Borneo.",
  keywords: "Kalimantan Utara, Wisata Kaltara, Hotel Kaltara, Tarakan, Malinau, Nunukan, Bulungan, Tana Tidung, Wisata Indonesia",
  authors: [{ name: "Explore Kaltara Team" }],
  creator: "Explore Kaltara",
  publisher: "Explore Kaltara",
  openGraph: {
    title: "Explore Kaltara - Jelajahi Keajaiban Kalimantan Utara",
    description: "Platform terdepan untuk menjelajahi destinasi wisata dan hotel terbaik di Kalimantan Utara",
    url: "https://explorekaltara.com",
    siteName: "Explore Kaltara",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Kaltara - Jelajahi Keajaiban Kalimantan Utara",
    description: "Platform terdepan untuk menjelajahi destinasi wisata dan hotel terbaik di Kalimantan Utara",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
