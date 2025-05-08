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
import { useAuthRedirect } from "@/helper/useAuthRedirect"
import StructuredData from "@/SEO/StructuredData"

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

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const fullScreenPaths = ["/", "/sync-user", "/sync-business", "/sync-plans", "/sync-reviewplan","/contactUs"]
  const isFullScreenLayout = fullScreenPaths.includes(pathname)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)
  
  if(pathname !== '/'){
    useAuthRedirect()
  }

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setViewportWidth(width)

     
      if (width >= 768 && width < 1024) {
        setNavCollapsed(true)
      }
    }

    
    if (typeof window !== "undefined") {
      checkScreenSize()
    }

    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const isMobileOrTablet = viewportWidth > 0 && viewportWidth < 1024

  if (isFullScreenLayout) {
    return (
      <ClerkProvider>
        <html lang="en">
          <head>
            <StructuredData />
          </head>
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
      <head>
            <StructuredData />
          </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster />
          <NavbarContext.Provider value={{ collapsed: navCollapsed, setCollapsed: setNavCollapsed }}>
            <div className="flex h-screen overflow-hidden">
             
              {!isMobileOrTablet && (
                <nav className="w-auto h-screen fixed left-0 top-0 overflow-y-auto z-20">
                  <Navbar />
                </nav>
              )}

              
              <div
                className={`flex-1 transition-all duration-300 flex flex-col ${
                  isMobileOrTablet ? "ml-0" : navCollapsed ? "ml-[60px] sm:ml-[80px]" : "ml-[200px] sm:ml-[264px]"
                }`}
              >
             
                <header
                  className={`fixed top-0 right-0 transition-all duration-300 z-10 bg-white ${
                    isMobileOrTablet
                      ? "left-0"
                      : navCollapsed
                        ? "left-[60px] sm:left-[80px]"
                        : "left-[200px] sm:left-[264px]"
                  }`}
                >
                  <HeaderBar />
                </header>

               
                <main
                  className={`flex-1 overflow-auto ${
                    isMobileOrTablet
                      ? "pt-14 pb-16 px-2" 
                      : "pt-16 pl-2"
                  }`}
                >
                  {children}
                </main>
              </div>

             
              {isMobileOrTablet && <Navbar />}
            </div>
          </NavbarContext.Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}
