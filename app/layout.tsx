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
  title: "Wow Burger | Addis Ababa's Favourite Burger & Fast Food Joint",
  description:
    "Experience the best smash burgers, wood-fired pizzas, crispy fried chicken, shawarma, and fresh Ethiopian juices at Wow Burger Bole, Addis Ababa.",
  keywords: [
    "Wow Burger",
    "Addis Ababa Burger",
    "Ethiopian Fast Food",
    "Smash Burger Bole",
    "Pizza Addis Ababa",
    "Avocado Juice Addis",
    "Spris Ethiopia",
    "Bole Road Restaurant",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
