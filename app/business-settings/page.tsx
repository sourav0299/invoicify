"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import "../globals.css"
import Image from "next/image"
import { toast } from "react-hot-toast"
import axios from "axios"
import { FaLocationCrosshairs } from "react-icons/fa6"
// import { useUserCheck } from "@/helper/useUserCheck"

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 16L8 9L14 15.5M20.5 18L16 13L11.7143 19M14 10H14.01M4 19H20C20.5523 19 21 18V6C21 5.44772 20.5523 5 20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19Z"
      stroke="#1EB386"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BusinessSettings = () => {
  const [isGstRegistered, setIsGstRegistered] = useState(true)
  const [businessLogo, setBusinessLogo] = useState<File | null>(null)
  const [location, setLocation] = useState({ city: "", state: "", pincode: "" })
  const [signature, setSignature] = useState<File | null>(null)
  const businessLogoRef = useRef<HTMLInputElement>(null)
  const signatureRef = useRef<HTMLInputElement>(null)
  const [businessLogoPreview, setBusinessLogoPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
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

  const [gstError, setGstError] = useState<string | null>(null)
  const [panError, setPanError] = useState<string | null>(null)
  const [gstInfo, setGstInfo] = useState<{ stateName: string } | null>(null)
  const [panInfo, setPanInfo] = useState<{ entityType: string } | null>(null)

  useEffect(() => {
    fetchBusinessDetails()
  }, [])

  useEffect(() => {
    return () => {
      if (businessLogoPreview) URL.revokeObjectURL(businessLogoPreview)
      if (signaturePreview) URL.revokeObjectURL(signaturePreview)
    }
  }, [businessLogoPreview, signaturePreview])

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch("/api/business-details")
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched business details:", data)
        setFormData(data)
        setIsGstRegistered(data.isGstRegistered)
        if (data.businessLogoUrl) {
          setBusinessLogoPreview(data.businessLogoUrl)
          console.log("Set business logo preview:", data.businessLogoUrl)
        }
        if (data.signatureUrl) {
          setSignaturePreview(data.signatureUrl)
          console.log("Set signature preview:", data.signatureUrl)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "gstNumber" && !value) {
      setGstError(null)
      setGstInfo(null)
    }

    if (name === "panNumber" && !value) {
      setPanError(null)
      setPanInfo(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "businessLogo" | "signature") => {
    console.log(`File change event triggered for ${type}`)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log(`File selected: ${file.name}`)
      const reader = new FileReader()

      reader.onload = (event) => {
        console.log(`FileReader onload event triggered for ${type}`)
        if (event.target && typeof event.target.result === "string") {
          if (type === "businessLogo") {
            setBusinessLogo(file)
            setBusinessLogoPreview(event.target.result)
            console.log("Business Logo Preview set:", event.target.result.substring(0, 50) + "...")
          } else {
            setSignature(file)
            setSignaturePreview(event.target.result)
            console.log("Signature Preview set:", event.target.result.substring(0, 50) + "...")
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
    try {
      const formDataToSend = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      formDataToSend.append("isGstRegistered", isGstRegistered.toString())

      if (businessLogo) {
        formDataToSend.append("businessLogo", businessLogo)
      }
      if (signature) {
        formDataToSend.append("signature", signature)
      }

      const method = formData.businessName ? "PUT" : "POST"
      const response = await fetch("/api/business-details", {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("form Submitted succesfully")

        await fetchBusinessDetails()
      } else {
        const errorData = await response.json()
        console.log("Failed to save business details:", errorData.error)
      }
    } catch (error) {
      console.log("Error saving business details:", error)
    }
  }

  // useUserCheck();

  return (
    <div className="bg-universal_gray_background pb-10 w-full min-h-screen">
      <div className="px-3 sm:px-6 gap-3 max-w-7xl mx-auto">
        <div className="py-4 sm:py-6 gap-1">
          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-business_settings_black_text mb-1">
            Your Business Details
          </div>
          <div className="text-sm sm:text-base md:text-lg font-medium text-business_settings_gray_text">
            An Overview of all your transactions over the year.
          </div>
        </div>
        <div className="rounded-lg bg-universal_white_background flex flex-col p-4 sm:p-5 md:p-6 h-auto gap-4 md:gap-5 shadow-sm">
          {/* Business Logo and Name Section */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            <div
              className="cursor-pointer flex flex-col items-center justify-center p-4 w-full md:w-[188px] h-[160px] md:h-[188px] rounded-lg border-dashed border-2 border-business_settings_gray_border mx-auto md:mx-0 hover:border-sidebar_green_button_background transition-colors duration-200 bg-universal_gray_background/50"
              onClick={() => businessLogoRef.current?.click()}
            >
              {businessLogoPreview ? (
                <Image
                  src={businessLogoPreview || "/placeholder.svg"}
                  alt="Business Logo"
                  className="w-full h-full object-contain rounded-md"
                  height={188}
                  width={188}
                />
              ) : (
                <>
                  <div className="bg-white/80 p-3 rounded-full mb-2">
                    <PhotoIcon />
                  </div>
                  <div className="text-xs font-medium text-sidebar_green_button_background">+ Upload Image</div>
                </>
              )}
              <input
                type="file"
                ref={businessLogoRef}
                onChange={(e) => handleFileChange(e, "businessLogo")}
                accept="image/*"
                hidden
              />
            </div>
            <div className="flex flex-col w-full gap-4 md:gap-6">
              <div className="p-4 bg-universal_gray_background rounded-lg gap-1 shadow-sm">
                <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                  Business Name
                </div>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-4 rounded-lg gap-1 shadow-sm">
                  <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                    Business Type
                  </div>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 text-sidebar_black_text appearance-none transition-colors duration-200"
                  >
                    <option value="">Select Business Type</option>
                    <option value="retailer">Retailer</option>
                    <option value="wholesaler">Wholesaler</option>
                  </select>
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-4 rounded-lg gap-1 shadow-sm mt-3 sm:mt-0">
                  <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                    Business Registration Type
                  </div>
                  <select
                    name="businessRegistrationType"
                    value={formData.businessRegistrationType}
                    onChange={handleInputChange}
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 text-sidebar_black_text appearance-none transition-colors duration-200"
                  >
                    <option value="">Select Registration Type</option>
                    <option value="private">Private Limited</option>
                    <option value="public">Public Limited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* GST and PAN Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-4 bg-universal_gray_background rounded-lg w-full sm:w-auto shadow-sm">
              <div className="text-sidebar_black_text text-xs font-medium mb-2">GST Registered?</div>
              <div className="flex gap-6 sm:gap-10">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                  <span className="text-sm py-1">Yes</span>
                  <input
                    type="radio"
                    name="gstRegistered"
                    value="yes"
                    checked={isGstRegistered}
                    className="custom-radio h-5 w-5 accent-sidebar_green_button_background"
                    onChange={() => setIsGstRegistered(true)}
                  />
                </label>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                  <span className="py-1 text-sm">No</span>
                  <input
                    type="radio"
                    name="gstRegistered"
                    value="no"
                    checked={!isGstRegistered}
                    className="custom-radio h-5 w-5 accent-sidebar_green_button_background"
                    onChange={() => setIsGstRegistered(false)}
                  />
                </label>
              </div>
            </div>
            <div
              className={`p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm mt-3 sm:mt-0 ${
                !isGstRegistered ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">GST Number</div>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className={`bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200 ${
                  !isGstRegistered ? "cursor-not-allowed" : ""
                }`}
                disabled={!isGstRegistered}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm mt-3 sm:mt-0">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">PAN Number</div>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
                placeholder="AAAAA0000A"
              />
            </div>
          </div>

          {/* Company Contact Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                Company E-mail
              </div>
              <input
                type="text"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
              />
            </div>
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm mt-3 sm:mt-0">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                Company Number
              </div>
              <input
                type="text"
                name="companyNumber"
                value={formData.companyNumber}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="flex gap-3">
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">
                Billing Address
              </div>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-20 sm:h-24 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 resize-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Location Button */}
          <button
            className="flex justify-end items-center gap-2 text-sm font-medium text-sidebar_green_button_background hover:text-sidebar_green_button_background/80 transition-colors duration-200 self-end"
            onClick={getlocation}
          >
            Get Current Location
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar_green_button_background/10 ml-1">
              <FaLocationCrosshairs className="text-sidebar_green_button_background" />
            </div>
          </button>

          {/* Location Details Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">State</div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
              />
            </div>
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm mt-3 sm:mt-0">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">Pincode</div>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
              />
            </div>
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm mt-3 sm:mt-0">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-1">City</div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-10 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-2 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Terms & Conditions Section */}
          <div className="flex">
            <div className="p-4 bg-universal_gray_background rounded-lg w-full gap-1 shadow-sm">
              <div className="bg-transparent w-full text-xs font-medium text-sidebar_black_text mb-2">
                Terms & Conditions
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <textarea
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  className="resize-none bg-transparent border border-business_settings_gray_border border-dashed w-full h-32 rounded-md focus:outline-none focus:border-sidebar_green_button_background focus:border-solid p-3 transition-colors duration-200"
                />
                <div
                  className="cursor-pointer flex flex-col justify-center items-center bg-transparent border-2 border-business_settings_gray_border border-dashed w-full md:max-w-[260px] h-32 rounded-md focus:outline-none p-1 hover:border-sidebar_green_button_background transition-colors duration-200"
                  onClick={() => signatureRef.current?.click()}
                >
                  {signaturePreview ? (
                    <Image
                      src={signaturePreview || "/placeholder.svg"}
                      alt="Signature"
                      className="max-w-full max-h-full object-contain rounded-md"
                      height={128}
                      width={240}
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-sidebar_green_button_background/10 p-2 rounded-full mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1EB386"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 16v-4h-4" />
                          <path d="M14 16H8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h8" />
                          <path d="M4 8V4h4" />
                          <path d="M4 8h6a2 2 0 0 0 2-2V4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-sidebar_green_button_background">
                        + Upload Signature
                      </span>
                    </div>
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              className="bg-universal_white_background px-4 py-3 border border-business_settings_gray_border flex items-center justify-center rounded-lg w-full max-w-[120px] sm:max-w-[150px] text-sm font-medium hover:bg-universal_gray_background/50 transition-colors duration-200"
              onClick={() => fetchBusinessDetails()}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-sidebar_green_button_background text-universal_white_background px-4 py-3 flex items-center justify-center rounded-lg w-full max-w-[120px] sm:max-w-[150px] text-sm font-medium hover:bg-sidebar_green_button_background/90 transition-colors duration-200"
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
