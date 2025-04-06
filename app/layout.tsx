"use client"

import type React from "react"

import localFont from "next/font/local"
import "./globals.css"
import Navbar from "./components/navBar"
import { ClerkProvider } from "@clerk/nextjs"
import HeaderBar from "./components/headerBar"
import { Toaster } from "react-hot-toast"
import { usePathname } from "next/navigation"
import { NavbarContext } from "./components/navBar"
import { useState, useEffect } from "react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const fullScreenPaths = ["/", "/sync-user", "/sync-business", "/sync-plans", "/sync-reviewplan"]
  const isFullScreenLayout = fullScreenPaths.includes(pathname)
  const [navCollapsed, setNavCollapsed] = useState(false)

  // Effect to check initial screen size
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setNavCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  if (isFullScreenLayout) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Toaster />
            <main className="w-full h-screen">{children}</main>
          </body>
        </html>
      </ClerkProvider>
    )
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster />
          <NavbarContext.Provider value={{ collapsed: navCollapsed, setCollapsed: setNavCollapsed }}>
            <div className="flex h-screen overflow-hidden">
              <nav className="w-auto h-screen fixed left-0 top-0 overflow-y-auto z-20">
                <Navbar />
              </nav>
              <div
                className={`flex-1 transition-all duration-300 ${navCollapsed ? "ml-[80px]" : "ml-[264px]"} flex flex-col`}
              >
                <header
                  className={`fixed top-0 right-0 transition-all duration-300 ${navCollapsed ? "left-[80px]" : "left-[264px]"} z-10 bg-white`}
                >
                  <HeaderBar />
                </header>
                <main className="flex-1 pt-16 pl-2 overflow-auto">{children}</main>
              </div>
            </div>
          </NavbarContext.Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}

