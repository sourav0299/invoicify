"use client"
import Link from "next/link"
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"


export const NavbarContext = createContext({
  collapsed: false,
  setCollapsed: (value: boolean) => {},
})

const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 5.5C3 4.11929 4.11929 3 5.5 3H8.5C9.88071 3 11 4.11929 11 5.5V8.5C11 9.88071 9.88071 11 8.5 11H5.5C4.11929 11 3 9.88071 3 8.5V5.5ZM5.5 5H8.5C8.77614 5 9 5.22386 9 5.5V8.5C9 8.77614 8.77614 9 8.5 9H5.5C5.22386 9 5 8.77614 5 8.5V5.5C5 5.22386 5.22386 5 5.5 5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 5.5C13 4.11929 14.1193 3 15.5 3H18.5C19.8807 3 21 4.11929 21 5.5V8.5C21 9.88071 19.8807 11 18.5 11H15.5C14.1193 11 13 9.88071 13 8.5V5.5ZM15.5 5H18.5C18.7761 5 19 5.22386 19 5.5V8.5C19 8.77614 18.7761 9 18.5 9H15.5C15.2239 9 15 8.77614 15 8.5V5.5C15 5.22386 15.2239 5 15.5 5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.5 13C14.1193 13 13 14.1193 13 15.5V18.5C13 19.8807 14.1193 21 15.5 21H18.5C19.8807 21 21 19.8807 21 18.5V15.5C21 14.1193 19.8807 13 18.5 13H15.5ZM18.5 15H15.5C15.2239 15 15 15.2239 15 15.5V18.5C15 18.7761 15.2239 19 15.5 19H18.5C18.7761 19 19 18.7761 19 18.5V15.5C19 15.2239 18.7761 15 18.5 15Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 15.5C3 14.1193 4.11929 13 5.5 13H8.5C9.88071 13 11 14.1193 11 15.5V18.5C11 19.8807 9.88071 21 8.5 21H5.5C4.11929 21 3 19.8807 3 18.5V15.5ZM5.5 15H8.5C8.77614 15 9 15.2239 9 15.5V18.5C9 18.7761 8.77614 19 8.5 19H5.5C5.22386 19 5 18.7761 5 18.5V15.5C5 15.2239 5.22386 15 5.5 15Z"
      fill="currentColor"
    />
  </svg>
)

const InvoiceManagementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M10 3V7C10 7.26522 9.89464 7.51957 9.70711 7.70711C9.51957 7.89464 9.26522 8 8 8H5M13 6H16M13 9H16M12 12V18M16 15H8M19 4V20C19 20.2652 18.8946 20.5196 18.7071 20.7071C18.5196 20.8946 18.2652 21 18 21H6C5.73478 21 5.48043 20.8946 5.29289 20.7071C5.10536 20.5196 5 20.2652 5 20V7.914C5.00006 7.64881 5.10545 7.39449 5.293 7.207L9.207 3.293C9.39449 3.10545 9.6488 3.00006 9.914 3H18C18.2652 3 18.5196 3.10536 18.7071 3.29289C18.8946 3.48043 19 3.73478 19 4ZM8 12V18H16V12H8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ProductManagementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M5.00525 11.1906V12L12.0026 16.0418L19 12V11.1906M5 16.1489V16.9582L11.9974 21L18.9948 16.9582V16.1489M12.0026 3L5.00525 7.04176L12.0026 11.0835L19 7.04176L12.0026 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PartiesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M16 19H20C20.5523 19 21 18.5523 21 18V17C21 15.3431 19.6569 14 18 14H16M13.7639 10C14.3132 10.6137 15.1115 11 16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C15.1115 5 14.3132 5.38625 13.7639 6M3 18V17C3 15.3431 4.34315 14 6 14H10C11.6569 14 13 15.3431 13 17V18C13 18.5523 12.5523 19 12 19H4C3.44772 19 3 18.5523 3 18ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const ExpensesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M17.65 8.2H5.05M17.65 8.2C18.2299 8.2 18.7 8.6701 18.7 9.25V11.98M17.65 8.2L13.45 4M5.05 8.2C4.4701 8.2 4 8.6701 4 9.25V19.75C4 20.3299 4.4701 20.8 5.05 20.8H17.65C18.2299 20.8 18.7 20.3299 18.7 19.75V17.02M5.05 8.2L9.25 4L13.45 8.2M19.75 12.4H15.55C14.3902 12.4 13.45 13.3402 13.45 14.5C13.45 15.6598 14.3902 16.6 15.55 16.6H19.75C20.3299 16.6 20.8 16.1299 20.8 15.55V13.45C20.8 12.8701 20.3299 12.4 19.75 12.4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M10 3V7C10 7.55228 9.55228 8 9 8H5M9 18V16M12 18V12M15 18V15M19 4V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V7.91421C5 7.649 5.10536 7.39464 5.29289 7.20711L9.20711 3.29289C9.39464 3.10536 9.649 3 9.91421 3H18C18.5523 3 19 3.44772 19 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BankAccountsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M3 20.9999H21M4 17.9999H20M6 9.99987L6 17.9999M10 9.99987L10 17.9999M14 9.99987L14 17.9999M18 9.99987L18 17.9999M4 9.49987V8.54457C4 8.20499 4.17233 7.88862 4.45761 7.70444L11.4576 3.18526C11.7878 2.9721 12.2122 2.9721 12.5424 3.18526L19.5424 7.70444C19.8277 7.88862 20 8.20499 20 8.54457V9.49987C20 9.77602 19.7761 9.99987 19.5 9.99987H4.5C4.22386 9.99987 4 9.77602 4 9.49987Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const InvoiceSettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M18.875 16.5C18.875 18.364 17.364 19.875 15.5 19.875M18.875 16.5C18.875 14.636 17.364 13.125 15.5 13.125M18.875 16.5L20 16.5M15.5 19.875C13.6361 19.875 12.125 18.364 12.125 16.5M15.5 19.875V21M12.125 16.5C12.125 14.636 13.6361 13.125 15.5 13.125M12.125 16.5L11 16.5001M15.5 13.125V12M13.1135 14.1135L12.318 13.318M18.682 19.682L17.8865 18.8865M13.1135 18.8865L12.318 19.682M18.682 13.318L17.8865 14.1135"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M18 9V4C18 3.44772 17.5523 3 17 3H8.91421C8.649 3 8.39464 3.10536 8.20711 3.29289L4.29289 7.20711C4.10536 7.39464 4 7.649 4 7.91421V20C4 20.5523 4.44772 21 5 21H9M9 3V7C9 7.55228 8.55228 8 8 8H4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BusinessSettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12.8804V11.1204C2 10.0804 2.85 9.22043 3.9 9.22043C5.71 9.22043 6.45 7.94042 5.54 6.37042C5.02 5.47042 5.33 4.30042 6.24 3.78042L7.97 2.79042C8.76 2.32042 9.78 2.60042 10.25 3.39042L10.36 3.58042C11.26 5.15042 12.74 5.15042 13.65 3.58042L13.76 3.39042C14.23 2.60042 15.25 2.32042 16.04 2.79042L17.77 3.78042C18.68 4.30042 18.99 5.47042 18.47 6.37042C17.56 7.94042 18.3 9.22043 20.11 9.22043C21.15 9.22043 22.01 10.0704 22.01 11.1204V12.8804C22.01 13.9204 21.16 14.7804 20.11 14.7804C18.3 14.7804 17.56 16.0604 18.47 17.6304C18.99 18.5404 18.68 19.7004 17.77 20.2204L16.04 21.2104C15.25 21.6804 14.23 21.4004 13.76 20.6104L13.65 20.4204C12.75 18.8504 11.27 18.8504 10.36 20.4204L10.25 20.6104C9.78 21.4004 8.76 21.6804 7.97 21.2104L6.24 20.2204C5.33 19.7004 5.02 18.5304 5.54 17.6304C6.45 16.0604 5.71 14.7804 3.9 14.7804C2.85 14.7804 2 13.9204 2 12.8804Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const HelpCenterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5 sm:w-6 sm:h-6"
  >
    <path
      d="M19.3449 15.1631L17.9445 13.7618C17.573 13.3904 17.0693 13.1818 16.5442 13.1818C16.019 13.1818 15.5154 13.3904 15.1438 13.7618L14.4437 14.4625C14.0723 14.8341 13.5686 15.0429 13.0433 15.0429C12.5181 15.0429 12.0144 14.8341 11.643 14.4625L9.54249 12.3605C9.17113 11.9888 8.9625 11.4848 8.9625 10.9592C8.9625 10.4336 9.17113 9.92951 9.54249 9.55785L10.2427 8.85718C10.6138 8.48539 10.8222 7.98137 10.8222 7.45586C10.8222 6.93035 10.6138 6.42633 10.2427 6.05453L8.84233 4.65321C8.6707 4.44865 8.45641 4.28417 8.21449 4.17132C7.97257 4.05848 7.7089 4 7.44199 4C7.17508 4 6.9114 4.05848 6.66949 4.17132C6.42757 4.28417 6.21327 4.44865 6.04165 4.65321C2.35876 8.31167 4.09718 12.5347 7.77807 16.2161C11.459 19.8976 15.68 21.6393 19.3449 17.9698C19.55 17.7981 19.7149 17.5834 19.8281 17.3409C19.9413 17.0985 20 16.8341 20 16.5665C20 16.2989 19.9413 16.0345 19.8281 15.792C19.7149 15.5495 19.55 15.3349 19.3449 15.1631Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path
      d="M20 12L8 12M20 12L16 16M20 12L16 8M9 4H7C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20H9"
      stroke="#FF7A7A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const InvoicifyIcon = () => (
  <svg
    width="25"
    height="40"
    viewBox="0 0 25 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-8 sm:w-7 sm:h-10"
  >
    <rect y="16" width="7.99999" height="7.99999" fill="#1EB386" />
    <rect x="24" y="24" width="8" height="7.99999" transform="rotate(180 24 24)" fill="#1EB386" />
    <path d="M8 16L16 8V16L8 24V16Z" fill="#ADEDD2" />
    <path d="M16 24L8.00001 32L8.00001 24L16 16L16 24Z" fill="#77DEB8" />
    <path d="M0 16L16 0V7.99999L7.99999 16H0Z" fill="#77DEB8" />
    <path d="M24 24L8.00002 40L8.00002 32L16 24L24 24Z" fill="#40C79A" />
  </svg>
)

// Define main navigation items
const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Invoice Management",
    href: "/invoice-management",
    icon: InvoiceManagementIcon,
  },
  {
    name: "Product Management",
    href: "/product-management",
    icon: ProductManagementIcon,
  },
  {
    name: "Parties",
    href: "/parties",
    icon: PartiesIcon,
  },
  {
    name: "Expenses",
    href: "/expenses",
    icon: ExpensesIcon,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ReportsIcon,
  },
  // {
  //   name: "Bank Accounts",
  //   href: "/bank-accounts",
  //   icon: BankAccountsIcon,
  // },
  {
    name: "Invoice Settings",
    href: "/invoice-settings",
    icon: InvoiceSettingsIcon,
  },
  {
    name: "Business Settings",
    href: "/business-settings",
    icon: BusinessSettingsIcon,
  },
  {
    name: "Help Center",
    href: "/help-center",
    icon: HelpCenterIcon,
  },
]


const mobileNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Invoices",
    href: "/invoice-management",
    icon: InvoiceManagementIcon,
  },
  {
    name: "Products",
    href: "/product-management",
    icon: ProductManagementIcon,
  },
  {
    name: "Parties",
    href: "/parties",
    icon: PartiesIcon,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { collapsed, setCollapsed } = useContext(NavbarContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)


  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
      
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setCollapsed(true)
      }
    }

   
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [setCollapsed])

 
  const isMobile = viewportWidth < 1024
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024

 
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

 
  if (isMobile) {
    return (
      <>
    
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <InvoicifyIcon />
                  <span className="ml-3 text-[#667085] text-lg font-medium">Invoicify</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <UserButton />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.fullName || "User"}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                      {user?.primaryEmailAddress?.emailAddress || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              
              <div className="flex-1 overflow-y-auto">
                <nav className="px-2 py-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-[#1EB386] text-white"
                            : "text-[#667085] hover:bg-[#e6f7f1] hover:text-[#1EB386]"
                        }`}
                      >
                        <span className={isActive ? "text-white" : "text-[#667085]"}>
                          <item.icon />
                        </span>
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              
              <div className="p-4 border-t border-gray-200">
                <SignOutButton>
                  <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-500 rounded-md hover:bg-red-50">
                    <LogoutIcon />
                    <span className="ml-3">Sign out</span>
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </div>

        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around items-center h-16">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-1/4 py-2 ${
                  isActive ? "text-[#1EB386]" : "text-[#667085]"
                }`}
              >
                <span className={isActive ? "text-[#1EB386]" : "text-[#667085]"}>
                  <item.icon />
                </span>
                <span className="mt-1 text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-1/4 py-2 text-[#667085]"
          >
            <Menu size={24} />
            <span className="mt-1 text-xs font-medium">Menu</span>
          </button>
        </div>
      </>
    )
  }

 
  return (
    <div
      className={`h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-[60px] sm:w-[80px]" : "w-[200px] sm:w-[264px]"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between ${collapsed ? "p-3 sm:p-4" : "p-4 sm:p-6"} mb-2`}>
          <div className={`flex items-center ${collapsed ? "w-full justify-center" : ""}`}>
            <div className="flex-shrink-0">
              <InvoicifyIcon />
            </div>
            {!collapsed && (
              <span className="ml-3 text-[#667085] text-base sm:text-xl font-medium truncate">Invoicify</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1 rounded-md hover:bg-gray-100 ${collapsed ? "absolute right-2 top-3 sm:static" : ""}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} className="sm:w-5 sm:h-5" /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <nav className={`space-y-1 ${collapsed ? "px-2" : "px-3 sm:px-4"}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${
                    collapsed ? "justify-center" : "justify-start"
                  } ${collapsed ? "px-2 py-2 sm:px-3 sm:py-3" : "px-3 py-2 sm:px-4 sm:py-3"} text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    isActive ? "bg-[#1EB386] text-white" : "text-[#667085] hover:bg-[#e6f7f1] hover:text-[#1EB386]"
                  }`}
                  title={collapsed ? item.name : ""}
                >
                  <span className={isActive ? "text-white" : "text-[#667085]"}>
                    <item.icon />
                  </span>
                  {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User section */}
        <div className={`p-2 sm:p-4 border-t border-gray-200 mt-auto`}>
          <div className={`flex ${collapsed ? "justify-center" : "justify-between"} items-center`}>
            {!collapsed && (
              <div className="flex items-center">
                <Link href="/user-details">
                  <div className="cursor-pointer">
                    <UserButton />
                  </div>
                </Link>
                <Link href="/user-details">
                  <div className="ml-3 cursor-pointer">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-[140px]">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[100px] sm:max-w-[140px]">
                      {user?.primaryEmailAddress?.emailAddress || "user@example.com"}
                    </p>
                  </div>
                </Link>
              </div>
            )}
            {collapsed ? (
              <Link href="/user-details">
                <div className="cursor-pointer">
                  <UserButton />
                </div>
              </Link>
            ) : (
              <SignOutButton>
                <button className="p-1 sm:p-2 text-red-500 hover:bg-red-50 rounded-md">
                  <LogoutIcon />
                </button>
              </SignOutButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
