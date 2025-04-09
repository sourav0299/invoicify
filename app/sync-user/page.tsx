"use client"

import { useState } from "react"
import { Eye, EyeOff, Upload } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

export default function SyncUser() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { user } = useUser()
  const { openUserProfile } = useClerk()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [userId, setUserId] = useState<number | null>(null)
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{6,15}$/
    if (!phone) {
      setPhoneError("Phone number is required")
      return false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number (6-15 digits)")
      return false
    }
    setPhoneError("")
    return true
  }

  const handleSave = async () => {
    // Validate inputs before saving
    const isEmailValid = validateEmail(email)
    const isPhoneValid = validatePhone(contactNumber)

    if (!isEmailValid || !isPhoneValid) {
      return
    }

    const userData = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      contactnumber: `${contactNumber}`,
    }

    try {
      let response
      if (userId) {
        response = await fetch(`/api/user-details/${email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        })
      } else {
        response = await fetch("/api/user-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        })
      }

      if (response.ok) {
        const updatedUser = await response.json()
        setUserId(updatedUser.id)
        alert("User details saved successfully!")
      } else {
        throw new Error("Failed to save user details")
      }
    } catch (error) {
      console.error("Error saving user details:", error)
      alert("Failed to save user details. Please try again.")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-10">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8">
              <svg width="25" height="40" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="16" width="7.99999" height="7.99999" fill="#1EB386" />
                <rect x="24.5" y="24" width="8" height="7.99999" transform="rotate(180 24.5 24)" fill="#1EB386" />
                <path d="M8.5 16L16.5 7.99998V16L8.5 24V16Z" fill="#ADEDD2" />
                <path d="M16.5 24L8.50001 32L8.50001 24L16.5 16L16.5 24Z" fill="#77DEB8" />
                <path d="M0.5 16L16.5 0V7.99999L8.49999 16H0.5Z" fill="#77DEB8" />
                <path d="M24.5 24L8.50002 40L8.50002 32L16.5 24L24.5 24Z" fill="#40C79A" />
              </svg>

            </div>
            <h1 className="text-xl font-medium text-[#333843]">Invoicify</h1>
          </div>
          <h2 className="text-3xl font-semibold text-[#212626]">Set Up your User Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
          {/* Profile Photo Section - Left Column */}
          <div className="flex flex-col items-center">
            <div className="w-[140px] h-[140px] rounded-full border border-[#e0e2e7] flex items-center justify-center bg-white overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <svg width="70" height="70" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M30 30C36.9036 30 42.5 24.4036 42.5 17.5C42.5 10.5964 36.9036 5 30 5C23.0964 5 17.5 10.5964 17.5 17.5C17.5 24.4036 23.0964 30 30 30Z"
                    stroke="#E0E2E7"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M5 55C5 45.335 16.1929 37.5 30 37.5C43.8071 37.5 55 45.335 55 55"
                    stroke="#E0E2E7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <button className="mt-4 flex items-center justify-center gap-1.5 text-[#1eb386] font-medium text-sm">
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Form Fields - Right Column */}
          <div className="flex flex-col space-y-8">
            {/* Name and Surname Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label htmlFor="name" className="block text-[#667085] mb-1.5 text-sm">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border border-dotted border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] focus:border-solid"
                />
              </div>

              <div>
                <label htmlFor="surname" className="block text-[#667085] mb-1.5 text-sm">
                  Surname
                </label>
                <input
                  id="surname"
                  type="text"
                  className="w-full px-3 py-2 border border-dotted border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] focus:border-solid"
                />
              </div>
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label htmlFor="email" className="block text-[#667085] mb-1.5 text-sm">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-dotted border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] focus:border-solid"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[#667085] mb-1.5 text-sm">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-dotted border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] focus:border-solid"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="relative">
                <label htmlFor="password" className="block text-[#667085] mb-1.5 text-sm">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-dotted border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] focus:border-solid pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-[#667085] mb-1.5 text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-dotted border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] focus:border-solid pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-12">
          <button className="px-6 py-2.5 border border-[#e0e2e7] rounded-md text-[#667085] font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2.5 bg-[#1eb386] text-white font-medium rounded-md hover:bg-[#19a077] transition-colors">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}

