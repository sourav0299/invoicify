"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navBar";
import { ClerkProvider } from "@clerk/nextjs";
import HeaderBar from "./components/headerBar";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/landing";

  if (isLandingPage) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Toaster />
            <main className="w-full h-screen">{children}</main>
          </body>
        </html>
      </ClerkProvider>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster />
          <div className="flex h-screen overflow-hidden">
            <nav className="w-auto h-screen fixed left-0 top-0 overflow-y-auto">
              <Navbar />
            </nav>
            <div className="flex-1 ml-64 flex flex-col">
              <header className="fixed top-0 right-0 left-64 z-10 bg-white">
                <HeaderBar />
              </header>
              <main className="flex-1 pt-16 pl-2 overflow-auto">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}