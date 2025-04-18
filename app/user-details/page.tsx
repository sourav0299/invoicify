"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import Image from "next/image"
import { ArrowLeft, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useUserCheck } from "@/helper/useUserCheck"

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
        const email = user.primaryEmailAddress?.emailAddress
        if (!email) {
          console.error("No email address found for user")
          return
        }

        console.log(`Fetching user details for email: ${email}`)
        const response = await fetch(`/api/user-details/${encodeURIComponent(email)}`)
        console.log("Fetch response status:", response.status)

        if (response.ok) {
          const userData = await response.json()
          console.log("Fetched user data:", userData)

          setFirstName(userData.firstname || "")
          setLastName(userData.lastname || "")
          setEmail(userData.email || "")
          setUserId(userData.id || null)

          if (userData.contactnumber) {
            console.log("Fetched contact number:", userData.contactnumber)

            const foundCountry = countries.find((country) => userData.contactnumber.startsWith(country.code))

            if (foundCountry) {
              setCountryCode(foundCountry.code)

              setContactNumber(userData.contactnumber.substring(foundCountry.code.length))
              console.log("Set country code:", foundCountry.code)
              console.log("Set contact number:", userData.contactnumber.substring(foundCountry.code.length))
            } else {
              setCountryCode("+1")
              setContactNumber(userData.contactnumber)
              console.log("No matching country code found, using default")
            }
          } else {
            console.log("No contact number found in user data")
            setContactNumber("")
          }
        } else {
          console.log("User not found in database, using Clerk data")
          setFirstName(user?.firstName ?? "")
          setLastName(user?.lastName ?? "")
          setEmail(email)
          setContactNumber("")
        }

        setImageUrl(user?.imageUrl ?? "")
      } catch (error) {
        console.error("Error fetching user details:", error)
        toast.error("Failed to load user details. Please refresh the page.")
      }
    }
  }

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showCountryDropdown && !target.closest(".country-dropdown-container")) {
        setShowCountryDropdown(false)
      }
    },
    [showCountryDropdown],
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

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
    const isEmailValid = validateEmail(email)
    const isPhoneValid = validatePhone(contactNumber)

    if (!isEmailValid || !isPhoneValid) {
      return
    }

    const fullContactNumber = `${countryCode}${contactNumber}`

    const userData = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      contactnumber: fullContactNumber,
    }

    const loadingToast = toast.loading("Saving user details...")

    try {
      console.log("Saving user data:", userData)

      const endpoint = email ? `/api/user-details/${encodeURIComponent(email)}` : "/api/user-details"
      const method = userId ? "PUT" : "POST"

      console.log(`Making ${method} request to ${endpoint}`)

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      })

      console.log("Response status:", response.status)

      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success("User details saved successfully!")

        if (responseData.id) {
          setUserId(responseData.id)
        }

        await fetchUserDetails()
      } else {
        throw new Error(responseData.message || `Error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error saving user details:", error)
      toast.dismiss(loadingToast)
      toast.error(`Failed to save user details: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const filteredCountries = countries.filter(
    (country) => country.name.toLowerCase().includes(searchQuery.toLowerCase()) || country.code.includes(searchQuery),
  )

  const selectedCountry = countries.find((country) => country.code === countryCode)

  useUserCheck()

  return (
    <div className="bg-universal_gray_background min-h-screen pb-24 sm:pb-16 overflow-x-hidden w-full">
      <div className="px-3 sm:px-4 md:px-6 gap-3 max-w-7xl mx-auto w-full box-border">
        <div className="py-4 sm:py-5 md:py-6 gap-1">
          <div className="flex items-center mb-3 sm:mb-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="gap-1 sm:gap-2 pl-0 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-business_settings_black_text">
            User Details
          </div>
          <div className="text-sm sm:text-base md:text-lg font-medium text-business_settings_gray_text">
            Manage your personal information and account settings
          </div>
        </div>
        <div className="rounded-lg bg-universal_white_background flex flex-col p-4 sm:p-5 md:p-6 h-auto gap-4 shadow-sm mb-16 sm:mb-8 w-full box-border">
          <div className="flex flex-col md:flex-row gap-5 md:gap-6">
            <div className="flex items-center justify-center w-full md:max-w-[260px] md:-mt-4">
              {imageUrl ? (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="User profile"
                  width={140}
                  height={140}
                  className="rounded-full w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] object-cover"
                />
              ) : (
                <div className="cursor-pointer flex flex-col items-center justify-center w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] rounded-full border-dashed border-2 border-business_settings_gray_border hover:border-sidebar_green_button_background transition-colors duration-200">
                  <div className="text-xs font-medium text-sidebar_green_button_background">+ Upload Image</div>
                </div>
              )}
            </div>
            <div className="flex flex-col w-full gap-4 sm:gap-5 md:gap-6">
              {/* First Name and Last Name - Side by side on all screens except mobile */}
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-3 sm:p-4 md:p-5 rounded-lg gap-1 shadow-sm">
                  <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                    First Name
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-3 sm:p-4 md:p-5 rounded-lg gap-1 shadow-sm mt-3 sm:mt-0">
                  <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                    Last Name
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-3 sm:p-4 md:p-5 rounded-lg gap-1 shadow-sm">
                  <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">E-mail</div>
                  <input
                    type="email"
                    className={`bg-transparent border ${emailError ? "border-red-500" : "border-business_settings_gray_border border-dashed"} w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) validateEmail(e.target.value)
                    }}
                    onBlur={() => validateEmail(email)}
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>

                <div className="flex flex-col w-full bg-universal_gray_background p-3 sm:p-4 md:p-5 rounded-lg gap-1 shadow-sm mt-3 sm:mt-0">
                  <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                    Mobile Number
                  </div>
                  <div className="flex flex-row gap-2 relative w-full overflow-hidden">
                    <div className="relative country-dropdown-container w-[90px] flex-shrink-0 ">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background hover:border-sidebar_green_button_background px-1 flex items-center justify-between transition-colors duration-200"
                      >
                        <span className="flex px-1 items-center">
                          <img
                            src={`https://flagcdn.com/w20/${selectedCountry?.iso}.png`}
                            alt={selectedCountry?.name}
                            className="mr-1 h-3 w-auto object-contain"
                          />
                          <span className="text-sm">{selectedCountry?.code}</span>
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-sidebar_green_button_background transition-transform duration-300 ease-in-out ${showCountryDropdown ? "transform rotate-180" : ""}`}
                        />
                      </button>

                      {showCountryDropdown && (
                        <div
                          className="absolute z-10 mt-1 w-[280px] max-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg"
                          style={{ maxWidth: "calc(100vw - 40px)", right: 0 }}
                        >
                          <div className="p-2 sticky top-0 bg-white border-b">
                            <input
                              type="text"
                              placeholder="Search countries..."
                              className="w-full p-2 border rounded-md text-sm"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div>
                            {filteredCountries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
                                onClick={() => {
                                  setCountryCode(country.code)
                                  setShowCountryDropdown(false)
                                  setSearchQuery("")
                                }}
                              >
                                <img
                                  src={`https://flagcdn.com/w20/${country.iso}.png`}
                                  alt={country.name}
                                  className="mr-2 h-3 w-auto object-contain"
                                />
                                <span>{country.name}</span>
                                <span className="ml-2 text-gray-500">{country.code}</span>
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <div className="px-4 py-2 text-gray-500 text-sm">No countries found</div>
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
                      className={`bg-transparent border ${phoneError ? "border-red-500" : "border-business_settings_gray_border border-dashed"} w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200`}
                      placeholder="Phone number"
                    />
                  </div>
                  {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                </div>
              </div>
              {/* Password Section */}
              <div className="flex flex-col md:flex-row gap-3 mt-1">
                <div className="p-3 sm:p-4 md:p-5 bg-universal_gray_background rounded-lg w-full md:w-3/5 gap-1 shadow-sm">
                  <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">Password</div>
                  <input
                    type="password"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none p-2"
                    value={"••••••••••••••••"}
                    readOnly
                  />
                </div>
                <div className="w-full md:w-2/5 flex items-center pb-1 mt-3 md:mt-0">
                  <button
                    className="w-full text-sm font-semibold bg-change_password_green_background text-sidebar_green_button_background border border-sidebar_green_button_background rounded-md py-1 px-2 h-10 hover:bg-sidebar_green_button_background/10 transition-colors duration-200"
                    onClick={() => openUserProfile()}
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 md:justify-end">
                <button
                  className="bg-universal_white_background px-4 h-12 py-2 border border-business_settings_gray_border flex items-center justify-center rounded-lg md:w-32 hover:bg-universal_gray_background/50 transition-colors duration-200 text-sm font-medium"
                  onClick={() => fetchUserDetails()}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-sidebar_green_button_background h-12 text-universal_white_background px-4 py-2 flex items-center justify-center rounded-lg md:w-32 focus:outline-none hover:bg-sidebar_green_button_background/90 transition-colors duration-200 text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 lg:ml-72">
            <button
              className="bg-universal_white_background px-4 h-12 py-2 border border-business_settings_gray_border flex items-center justify-center rounded-lg flex-1 hover:bg-universal_gray_background/50 transition-colors duration-200 text-sm font-medium"
              onClick={() => fetchUserDetails()}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-sidebar_green_button_background h-12 text-universal_white_background px-4 py-2 flex items-center justify-center rounded-lg flex-1 focus:outline-none hover:bg-sidebar_green_button_background/90 transition-colors duration-200 text-sm font-medium"
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
