"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import NotificationPanel from "./notification-panel"
import { Bell } from "lucide-react"

interface DropDownIconProps {
  isOpen: boolean
}

interface Notification {
  id: string
  type: "low-stock" | "out-of-stock" | "invoice" | "payment"
  title: string
  description: string
  timestamp: string
  read: boolean
}

const DropDownIcon: React.FC<DropDownIconProps> = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
)

const HeaderBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [businessDetails, setBusinessDetails] = useState<{
    businessName: string
    businessLogoUrl: string
  } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [credits, setCredits] = useState<number>(0)

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await fetch("/api/business-details")
        if (response.ok) {
          const data = await response.json()
          setBusinessDetails({
            businessName: data.businessName,
            businessLogoUrl: data.businessLogoUrl,
          })
        } else {
          console.log("Failed to fetch business details")
        }
      } catch (error) {
        console.log("Error fetching business details:", error)
      }
    }

    fetchBusinessDetails()

    const fetchCredits = async () => {
      try {
      
        const mockCredits = 2500
        setCredits(mockCredits)
      } catch (error) {
        console.log("Error fetching credits:", error)
      }
    }

    
    fetchCredits()

    const fetchNotifications = async () => {
      try {

        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "low-stock",
            title: "Low Stock Alert",
            description: "Printer paper is running low (5 units remaining)",
            timestamp: "10 minutes ago",
            read: false,
          },
          {
            id: "2",
            type: "out-of-stock",
            title: "Out of Stock",
            description: "Blue ink cartridges are out of stock",
            timestamp: "1 hour ago",
            read: false,
          },
          {
            id: "3",
            type: "invoice",
            title: "Invoice Generated",
            description: "Invoice #INV-2023-042 has been generated",
            timestamp: "3 hours ago",
            read: true,
          },
          {
            id: "4",
            type: "payment",
            title: "Payment Received",
            description: "₹5,000 received from Customer ABC",
            timestamp: "4 hours ago",
            read: false,
          },
          {
            id: "5",
            type: "low-stock",
            title: "Low Stock Alert",
            description: "A4 notebooks are running low (8 units remaining)",
            timestamp: "5 hours ago",
            read: true,
          },
          {
            id: "6",
            type: "invoice",
            title: "Invoice Generated",
            description: "Invoice #INV-2023-041 has been generated",
            timestamp: "Yesterday",
            read: true,
          },
        ]

        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter((n) => !n.read).length)
      } catch (error) {
        console.log("Error fetching notifications:", error)
      }
    }

    // Call the function
    fetchNotifications()

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const handleReadNotification = (id: string) => {
    if (!notifications.find((n) => n.id === id)?.read) {
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => prev - 1)
    }
  }

  return (
    <div className="w-full h-14 sm:h-16 flex items-center justify-end px-3 py-2 sm:p-6 bg-white shadow-sm ml-2">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div
          className="cursor-pointer p-1 sm:p-0 relative"
          onClick={(e) => {
            e.stopPropagation()
            setIsNotificationOpen(!isNotificationOpen)
            setIsMenuOpen(false)
          }}
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {isNotificationOpen && (
          <div
            ref={notificationRef}
            className="absolute top-14 sm:top-16 right-0 z-20 transition-all duration-300 ease-in-out"
          >
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllAsRead={handleMarkAllAsRead}
              onReadNotification={handleReadNotification}
            />
          </div>
        )}
      
        <div className="flex items-center bg-gradient-to-r from-green-50 to-green-100 rounded-lg px-3 py-1.5 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center space-x-1.5">
            <span className="text-green-600 font-bold text-lg group-hover:scale-105 transition-transform">₹</span>
            <span className="font-semibold text-gray-800 text-base md:text-lg tracking-tight group-hover:text-green-700 transition-colors">
              {credits.toLocaleString()}
            </span>
          </div>
        </div>
        <div
          ref={dropdownRef}
          className="flex items-center space-x-1 sm:space-x-2 cursor-pointer relative"
          onClick={toggleMenu}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
            {businessDetails?.businessLogoUrl ? (
              <Image
                src={businessDetails.businessLogoUrl || "/placeholder.svg"}
                alt="Business Logo"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                Logo
              </div>
            )}
          </div>
          <div className="text-xs sm:text-sm font-medium max-w-[100px] sm:max-w-none truncate">
            {businessDetails?.businessName || "Business Name"}
          </div>
          <div className="relative">
            <DropDownIcon isOpen={isMenuOpen} />
            {isMenuOpen && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-300 ease-in-out mt-2">
                <Link href="/business-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Edit Business Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderBar
