"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
// import "./app/globals.css"
import Image from "next/image"
import { toast } from "react-hot-toast"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { useUserCheck } from "@/helper/useUserCheck"

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 16L8 9L14 15.5M20.5 18L16 13L11.7143 19M14 10H14.01M4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19Z"
      stroke="#1EB386"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BusinessSettings = () => {
  const [isGstRegistered, setIsGstRegistered] = useState(true)
  const [signature, setSignature] = useState<File | null>(null)
  const [businessLogo, setBusinessLogo] = useState<File | null>(null)
  const signatureRef = useRef<HTMLInputElement>(null)
  const businessLogoRef = useRef<HTMLInputElement>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [businessLogoPreview, setBusinessLogoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessRegistrationType: "",
    gstNumber: "",
    panNumber: "",
    companyEmail: "",
    companyNumber: "",
    billingAddress: "",
    state: "",
    pincode: "",
    city: "",
    termsAndConditions: "",
  })
  const [errors, setErrors] = useState({
    gstNumber: "",
    panNumber: "",
  })

  useEffect(() => {
    fetchBusinessDetails()
  }, [])

  useEffect(() => {
    return () => {
      if (signaturePreview) URL.revokeObjectURL(signaturePreview)
      if (businessLogoPreview) URL.revokeObjectURL(businessLogoPreview)
    }
  }, [signaturePreview, businessLogoPreview])

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch("/api/business-details")
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched business details:", data)
        setFormData(data)
        setIsGstRegistered(data.isGstRegistered)
        if (data.signatureUrl) {
          setSignaturePreview(data.signatureUrl)
          console.log("Set signature preview:", data.signatureUrl)
        }
        if (data.businessLogoUrl) {
          setBusinessLogoPreview(data.businessLogoUrl)
          console.log("Set business logo preview:", data.businessLogoUrl)
        }
      } else {
        console.log("Failed to fetch business details")
      }
    } catch (error) {
      console.log("Error fetching business details:", error)
    }
  }

  const getlocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            const API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`,
            )
            if (response.data.results.length > 0) {
              const details = response.data.results[0].components
              setFormData((prev) => ({
                ...prev,
                city: details.city || details.town || details.village || "",
                state: details.state || "",
                pincode: details.postcode || "",
              }))
              toast.success("Location updated successfully!")
            }
          } catch (error) {
            console.error("error", error)
          }
        },
        (error) => {
          console.error("error getting location: ", error)
        },
      )
    } else {
      console.error("geolocation is not supported by this browser")
    }
  }

  const validateGSTNumber = (gstNumber: string): boolean => {
    // GST format: 2 digits + 5 letters + 4 digits + 1 letter + 1 letter/digit + Z + 1 letter/digit
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

    if (!gstNumber) {
      setErrors((prev) => ({ ...prev, gstNumber: "GST Number is required" }))
      return false
    }

    if (gstNumber.length !== 15) {
      setErrors((prev) => ({ ...prev, gstNumber: "GST Number must be 15 characters" }))
      return false
    }

    if (!gstRegex.test(gstNumber)) {
      setErrors((prev) => ({ ...prev, gstNumber: "Invalid GST Number format (e.g. 27AAPFU0939F1ZV)" }))
      return false
    }

    setErrors((prev) => ({ ...prev, gstNumber: "" }))
    return true
  }

  const validatePANNumber = (panNumber: string): boolean => {
    // PAN format: 5 letters + 4 digits + 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

    if (!panNumber) {
      setErrors((prev) => ({ ...prev, panNumber: "PAN Number is required" }))
      return false
    }

    if (panNumber.length !== 10) {
      setErrors((prev) => ({ ...prev, panNumber: "PAN Number must be 10 characters" }))
      return false
    }

    if (!panRegex.test(panNumber)) {
      setErrors((prev) => ({ ...prev, panNumber: "Invalid PAN Number format (e.g. ABCDE1234F)" }))
      return false
    }

    setErrors((prev) => ({ ...prev, panNumber: "" }))
    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate GST and PAN numbers as user types
    if (name === "gstNumber" && isGstRegistered) {
      validateGSTNumber(value)
    }

    if (name === "panNumber") {
      validatePANNumber(value)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "signature" | "businessLogo") => {
    console.log(`File change event triggered for ${type}`)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log(`File selected: ${file.name}`)
      const reader = new FileReader()

      reader.onload = (event) => {
        console.log(`FileReader onload event triggered for ${type}`)
        if (event.target && typeof event.target.result === "string") {
          if (type === "signature") {
            setSignature(file)
            setSignaturePreview(event.target.result)
            console.log("Signature Preview set:", event.target.result.substring(0, 50) + "...")
          } else if (type === "businessLogo") {
            setBusinessLogo(file)
            setBusinessLogoPreview(event.target.result)
            console.log("Business Logo Preview set:", event.target.result.substring(0, 50) + "...")
          }
        }
      }

      reader.onerror = (error) => {
        console.error(`FileReader error for ${type}:`, error)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // Validate all fields before submission
    let isValid = true

    // Validate GST number if registered
    if (isGstRegistered) {
      const isGstValid = validateGSTNumber(formData.gstNumber)
      if (!isGstValid) {
        toast.error("Please enter a valid GST Number")
        isValid = false
      }
    }

    // Validate PAN number
    const isPanValid = validatePANNumber(formData.panNumber)
    if (!isPanValid) {
      toast.error("Please enter a valid PAN Number")
      isValid = false
    }

    if (!isValid) return

    try {
      const formDataToSend = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      // Append isGstRegistered
      formDataToSend.append("isGstRegistered", isGstRegistered.toString())

      // Append files if they exist
      if (signature) {
        formDataToSend.append("signature", signature)
      }

      if (businessLogo) {
        formDataToSend.append("businessLogo", businessLogo)
      }

      const method = formData.businessName ? "PUT" : "POST"
      const response = await fetch("/api/business-details", {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("form Submitted succesfully")
        window.location.href = "/sync-plans"
        // Optionally, you can refresh the data here
        await fetchBusinessDetails()
      } else {
        const errorData = await response.json()
        console.log("Failed to save business details:", errorData.error)
      }
    } catch (error) {
      console.log("Error saving business details:", error)
    }
  }

  useUserCheck()
  return (
    <div className="bg-universal_gray_background pb-10">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto">
        <div className="flex flex-col items-center py-4">
          {/* Logo and heading area */}
          <div className="flex items-center justify-center mb-4">
            <svg width="36" height="41" viewBox="0 0 36 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6.50098" y="16.5" width="7.99999" height="7.99999" fill="#1EB386" />
              <rect x="30.501" y="24.5" width="8" height="7.99999" transform="rotate(180 30.501 24.5)" fill="#1EB386" />
              <path d="M14.501 16.5L22.501 8.49998V16.5L14.501 24.5V16.5Z" fill="#ADEDD2" />
              <path d="M22.501 24.5L14.501 32.5L14.501 24.5L22.501 16.5L22.501 24.5Z" fill="#77DEB8" />
              <path d="M6.50098 16.5L22.5009 0.5V8.49999L14.501 16.5H6.50098Z" fill="#77DEB8" />
              <path d="M30.501 24.5L14.501 40.5L14.501 32.5L22.501 24.5L30.501 24.5Z" fill="#40C79A" />
            </svg>

            <span className="ml-2 text-xl font-semibold text-[#667085]">Invoicify</span>
          </div>

          {/* Heading area */}
          <div className="text-3xl font-semibold text-business_settings_black_text text-center">
            Set Up your Business Details
          </div>
        </div>

        <div className="rounded-lg bg-universal_white_background flex flex-col p-3 sm:p-6 h-auto gap-4">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Business Logo Upload Section */}
            <div className="flex flex-col items-center">
              <div
                className="w-[140px] h-[140px] border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50"
                onClick={() => businessLogoRef.current?.click()}
              >
                {businessLogoPreview ? (
                  <Image
                    src={businessLogoPreview || "/placeholder.svg"}
                    alt="Business Logo"
                    width={120}
                    height={120}
                    className="object-contain max-w-full max-h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-300"
                    >
                      <rect width="24" height="24" fill="white" />
                      <path
                        d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  ref={businessLogoRef}
                  onChange={(e) => handleFileChange(e, "businessLogo")}
                  accept="image/*"
                  hidden
                />
              </div>
              <button
                className="mt-2 text-[#1EB386] text-sm flex items-center gap-1"
                onClick={() => businessLogoRef.current?.click()}
              >
                Upload Logo Image
              </button>
            </div>

            {/* Business Details Section */}
            <div className="flex flex-col w-full gap-6">
              <div className="p-5 bg-universal_gray_background rounded-lg gap-1">
                <div className="bg-transparent w-full text-xs text-sidebar_black_text">Business Name</div>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                />
              </div>
              <div className="flex w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">Business Type</div>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 text-sidebar_black_text"
                  >
                    <option value="">Select Business Type</option>
                    <option value="retailer">Retailer</option>
                    <option value="wholesaler">Wholesaler</option>
                  </select>
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    Business Registration Type
                  </div>
                  <select
                    name="businessRegistrationType"
                    value={formData.businessRegistrationType}
                    onChange={handleInputChange}
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 text-sidebar_black_text"
                  >
                    <option value="">Select Registration Type</option>
                    <option value="private">Private Limited</option>
                    <option value="public">Public Limited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg">
              <div className="text-sidebar_black_text text-xs">Gst Registered?</div>
              <div className="flex gap-10">
                <label className="flex items-center gap-3">
                  <span className="text-sm py-3">Yes</span>
                  <input
                    type="radio"
                    name="gstRegistered"
                    value="yes"
                    checked={isGstRegistered}
                    className="custom-radio h-4 w-4"
                    onChange={() => setIsGstRegistered(true)}
                  />
                </label>
                <label className="flex items-center gap-3">
                  <span className="py-3 text-sm">No</span>
                  <input
                    type="radio"
                    name="gstRegistered"
                    value="no"
                    checked={!isGstRegistered}
                    className="custom-radio h-4 w-4"
                    onChange={() => {
                      setIsGstRegistered(false)
                      setErrors((prev) => ({ ...prev, gstNumber: "" }))
                      setFormData((prev) => ({ ...prev, gstNumber: "" }))
                    }}
                  />
                </label>
              </div>
            </div>
            <div
              className={`p-5 bg-universal_gray_background rounded-lg w-full gap-1 ${
                !isGstRegistered ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Gst Number</div>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className={`bg-transparent border ${errors.gstNumber ? "border-red-500" : "border-business_settings_gray_border"} border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 ${
                  !isGstRegistered ? "cursor-not-allowed" : ""
                }`}
                disabled={!isGstRegistered}
                placeholder="27AAPFU0939F1ZV"
              />
              {errors.gstNumber && isGstRegistered && <p className="text-xs text-red-500 mt-1">{errors.gstNumber}</p>}
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">PAN Number</div>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className={`bg-transparent border ${errors.panNumber ? "border-red-500" : "border-business_settings_gray_border"} border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1`}
                placeholder="ABCDE1234F"
              />
              {errors.panNumber && <p className="text-xs text-red-500 mt-1">{errors.panNumber}</p>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full max-w-[365px] gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Company E-mail</div>
              <input
                type="text"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Company Number</div>
              <input
                type="text"
                name="companyNumber"
                value={formData.companyNumber}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Billing Address</div>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-24 rounded-[4px] focus:outline-none p-1 resize-none"
              />
            </div>
          </div>
          <Button
            className="flex justify-end items-center gap-4 ml-auto sm:ml-[88%] w-auto sm:w-auto"
            onClick={getlocation}
          >
            Get Location
          </Button>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">State</div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Pincode</div>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">City</div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Terms & Conditions</div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <textarea
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  className="resize-none bg-transparent border border-business_settings_gray_border border-dashed w-full h-32 rounded-[4px] focus:outline-none p-4"
                />
                <div
                  className="cursor-pointer flex flex-col justify-center items-center bg-transparent border border-business_settings_gray_border border-dashed w-full sm:max-w-[260px] h-32 rounded-[4px] focus:outline-none p-1 mt-3 sm:mt-0"
                  onClick={() => signatureRef.current?.click()}
                >
                  {signaturePreview ? (
                    <Image
                      src={signaturePreview || "/placeholder.svg"}
                      alt="Signature"
                      className="max-w-full max-h-full object-contain"
                      height={128}
                      width={240}
                    />
                  ) : (
                    <span className="text-sidebar_green_button_background">+ Upload Signature</span>
                  )}
                  <input
                    type="file"
                    ref={signatureRef}
                    onChange={(e) => handleFileChange(e, "signature")}
                    accept="image/*"
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              onClick={handleSave}
              className="bg-sidebar_green_button_background text-universal_white_background px-4 py-[10px] flex items-center justify-center rounded-lg w-full sm:max-w-[190px] mt-2 sm:mt-0"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessSettings
