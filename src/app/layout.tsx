import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserStateProvider } from "@/context/useUserContext";
import MainLayout from "@/common/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveAndBuddy",
  description: "기억을 남기고, 마음을 이어주는 동행자",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <UserStateProvider>{children}</UserStateProvider>
        </div>
      </body>
    </html>
  );
}
