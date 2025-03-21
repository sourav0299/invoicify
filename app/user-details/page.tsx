"use client"

import { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Country data with codes and flags
const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸", iso: "us" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", iso: "gb" },
  { code: "+91", name: "India", flag: "🇮🇳", iso: "in" },
  { code: "+61", name: "Australia", flag: "🇦🇺", iso: "au" },
  { code: "+86", name: "China", flag: "🇨🇳", iso: "cn" },
  { code: "+49", name: "Germany", flag: "🇩🇪", iso: "de" },
  { code: "+33", name: "France", flag: "🇫🇷", iso: "fr" },
  { code: "+81", name: "Japan", flag: "🇯🇵", iso: "jp" },
  { code: "+7", name: "Russia", flag: "🇷🇺", iso: "ru" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", iso: "br" },
  { code: "+34", name: "Spain", flag: "🇪🇸", iso: "es" },
  { code: "+39", name: "Italy", flag: "🇮🇹", iso: "it" },
  { code: "+52", name: "Mexico", flag: "🇲🇽", iso: "mx" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", iso: "kr" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱", iso: "nl" },
  { code: "+90", name: "Turkey", flag: "🇹🇷", iso: "tr" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", iso: "sa" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", iso: "za" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", iso: "ch" },
  { code: "+46", name: "Sweden", flag: "🇸🇪", iso: "se" },
  { code: "+47", name: "Norway", flag: "🇳🇴", iso: "no" },
  { code: "+45", name: "Denmark", flag: "🇩🇰", iso: "dk" },
  { code: "+358", name: "Finland", flag: "🇫🇮", iso: "fi" },
  { code: "+48", name: "Poland", flag: "🇵🇱", iso: "pl" },
  { code: "+43", name: "Austria", flag: "🇦🇹", iso: "at" },
  { code: "+32", name: "Belgium", flag: "🇧🇪", iso: "be" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", iso: "pt" },
  { code: "+30", name: "Greece", flag: "🇬🇷", iso: "gr" },
  { code: "+353", name: "Ireland", flag: "🇮🇪", iso: "ie" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿", iso: "nz" },
  { code: "+65", name: "Singapore", flag: "🇸🇬", iso: "sg" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", iso: "my" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", iso: "th" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", iso: "ph" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", iso: "id" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", iso: "vn" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪", iso: "ae" },
  { code: "+972", name: "Israel", flag: "🇮🇱", iso: "il" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", iso: "eg" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", iso: "ng" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", iso: "ke" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", iso: "bd" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", iso: "pk" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", iso: "lk" },
  { code: "+977", name: "Nepal", flag: "🇳🇵", iso: "np" },
  { code: "+95", name: "Myanmar", flag: "🇲🇲", iso: "mm" },
  { code: "+855", name: "Cambodia", flag: "🇰🇭", iso: "kh" },
  { code: "+856", name: "Laos", flag: "🇱🇦", iso: "la" },
  { code: "+853", name: "Macau", flag: "🇲🇴", iso: "mo" },
  { code: "+852", name: "Hong Kong", flag: "🇭🇰", iso: "hk" },
].sort((a, b) => a.name.localeCompare(b.name))

const UserDetails = () => {
  const { user } = useUser()
  const { openUserProfile } = useClerk()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [userId, setUserId] = useState<number | null>(null)
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserDetails()
    }
  }, [user])

  const fetchUserDetails = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`/api/user-details/${user.primaryEmailAddress?.emailAddress}`)
        if (response.ok) {
          const userData = await response.json()
          setFirstName(userData.firstname)
          setLastName(userData.lastname)
          setEmail(userData.email)

          // Handle phone number with country code
          if (userData.contactnumber) {
            // Find the country code that matches the beginning of the phone number
            const foundCountry = countries.find((country) => userData.contactnumber.startsWith(country.code))

            if (foundCountry) {
              setCountryCode(foundCountry.code)
              // Remove the country code from the phone number
              setContactNumber(userData.contactnumber.substring(foundCountry.code.length))
            } else {
              // If no matching country code is found, use default
              setCountryCode("+1")
              setContactNumber(userData.contactnumber)
            }
          }

          setUserId(userData.id)
        } else {
          setFirstName(user?.firstName ?? "")
          setLastName(user?.lastName ?? "")
          setEmail(user?.primaryEmailAddress?.emailAddress ?? "")
        }
        setImageUrl(user?.imageUrl ?? "")
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }
  }

  useEffect(() => {
    // Close country dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest(".country-dropdown-container")) {
        setShowCountryDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCountryDropdown])

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
      contactnumber: `${countryCode}${contactNumber}`,
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

  const filteredCountries = countries.filter(
    (country) => country.name.toLowerCase().includes(searchQuery.toLowerCase()) || country.code.includes(searchQuery),
  )

  const selectedCountry = countries.find((country) => country.code === countryCode)

  return (
    <div className="bg-universal_gray_background pb-10 h-full">
      <div className="px-6 gap-3">
        <div className="py-6 gap-1">
          <div className="flex items-center mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 pl-0 text-gray-600 hover:text-gray-900">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="text-3xl font-semibold text-business_settings_black_text">User Details</div>
          <div className="text-lg font-medium text-business_settings_gray_text">
            Manage your personal information and account settings
          </div>
        </div>
        <div className="rounded-lg bg-universal_white_background flex flex-col p-6 h-auto gap-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center justify-center w-full max-w-[260px]">
              {imageUrl ? (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="User profile"
                  width={160}
                  height={160}
                  className="rounded-full"
                />
              ) : (
                <div className="cursor-pointer flex flex-col items-center justify-center w-[160px] h-[160px] rounded-full border-dashed border border-business_settings_gray_border">
                  <div className="text-xs font-medium text-sidebar_green_button_background">+ Upload Image</div>
                </div>
              )}
            </div>
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-col md:flex-row w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">First Name</div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">Last Name</div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">E-mail</div>
                  <input
                    type="email"
                    className={`bg-transparent border ${emailError ? "border-red-500" : "border-business_settings_gray_border border-dashed"} w-full h-8 rounded-[4px] focus:outline-none p-1`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) validateEmail(e.target.value)
                    }}
                    onBlur={() => validateEmail(email)}
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">Mobile Number</div>
                  <div className="flex gap-2 relative">
                    <div className="relative country-dropdown-container">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="bg-transparent border border-business_settings_gray_border border-dashed min-w-[120px] h-8 rounded-[4px] focus:outline-none px-2 flex items-center justify-between"
                      >
                        <span className="flex items-center">
                          <img
                            src={`https://flagcdn.com/w20/${selectedCountry?.iso}.png`}
                            alt={selectedCountry?.name}
                            className="mr-2 h-4 w-auto object-contain"
                          />
                          <span>{selectedCountry?.code}</span>
                        </span>
                        <span className="ml-1">▼</span>
                      </button>

                      {showCountryDropdown && (
                        <div className="absolute z-10 mt-1 w-[280px] max-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="p-2 sticky top-0 bg-white border-b">
                            <input
                              type="text"
                              placeholder="Search countries..."
                              className="w-full p-2 border rounded-md"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div>
                            {filteredCountries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  setCountryCode(country.code)
                                  setShowCountryDropdown(false)
                                  setSearchQuery("")
                                }}
                              >
                                <img
                                  src={`https://flagcdn.com/w20/${country.iso}.png`}
                                  alt={country.name}
                                  className="mr-2 h-4 w-auto object-contain"
                                />
                                <span>{country.name}</span>
                                <span className="ml-2 text-gray-500">{country.code}</span>
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <div className="px-4 py-2 text-gray-500">No countries found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => {
                        setContactNumber(e.target.value)
                        if (phoneError) validatePhone(e.target.value)
                      }}
                      onBlur={() => validatePhone(contactNumber)}
                      className={`bg-transparent border ${phoneError ? "border-red-500" : "border-business_settings_gray_border border-dashed"} w-full h-8 rounded-[4px] focus:outline-none p-1`}
                      placeholder="Phone number"
                    />
                  </div>
                  {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1 max-w-full md:max-w-[607px]">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Password</div>
              <input
                type="password"
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                value={"••••••••••••••••"}
                readOnly
              />
            </div>
            <div className="w-full flex items-center max-w-full md:max-w-[271px] pb-1 mt-3 md:mt-0">
              <button
                className="w-full text-sm font-semibold bg-change_password_green_background text-sidebar_green_button_background border border-sidebar_green_button_background rounded py-1 px-2 h-8"
                onClick={() => openUserProfile()}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button className="bg-universal_white_background px-4 h-10 py-[10px] border flex items-center justify-center rounded-lg w-full max-w-[190px]">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-sidebar_green_button_background h-10 text-universal_white_background px-4 py-[10px] flex items-center justify-center rounded-lg w-full max-w-[190px] focus:outline-none"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails

