"use client"
import { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import Image from "next/image"

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
            if (userData.contactnumber.startsWith("+")) {
              // Extract country code and number if it's already formatted
              const match = userData.contactnumber.match(/^(\+\d+)(.*)$/)
              if (match) {
                setCountryCode(match[1])
                setContactNumber(match[2])
              } else {
                setContactNumber(userData.contactnumber)
              }
            } else {
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
  return (
    <div className=" bg-universal_gray_background pb-10 h-full">
      <div className="px-6 gap-3">
        <div className="py-6 gap-1">
          <div className="text-3xl font-semibold text-business_settings_black_text">User Details</div>
          <div className="text-lg font-medium text-business_settings_gray_text">
            An Overview of all your transactions over the year.
          </div>
        </div>
        <div className="rounded-lg bg-universal_white_background flex flex-col p-6 h-auto gap-4">
          <div className="flex gap-6">
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
              <div className="flex w-full gap-3">
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
              <div className="flex w-full gap-3">
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
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent border border-business_settings_gray_border border-dashed w-[100px] h-8 rounded-[4px] focus:outline-none px-1"
                    >
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+91">+91 (IN)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+86">+86 (CN)</option>
                      <option value="+49">+49 (DE)</option>
                      <option value="+33">+33 (FR)</option>
                      <option value="+81">+81 (JP)</option>
                      <option value="+7">+7 (RU)</option>
                      <option value="+55">+55 (BR)</option>
                    </select>
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
          <div className="flex justify-end gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1 max-w-[607px]">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Password</div>
              <input
                type="password"
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                value={"12345678999999999"}
                readOnly
              />
            </div>
            <div className="w-full flex items-center max-w-[271px] pb-1">
              <button
                className="w-full text-sm font-semibold bg-change_password_green_background text-sidebar_green_button_background border border-sidebar_green_button_background rounded py-1 px-2 h-8"
                onClick={() => openUserProfile()}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
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

