"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import "../globals.css"
import Image from "next/image"
import { toast } from "react-hot-toast"
import axios from "axios"
import { FaLocationCrosshairs } from "react-icons/fa6"
// Add this import at the top of the file
// import { validateGSTNumber, validatePANNumber, getPANEntityType, getGSTStateName } from "./validation-helper"

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

  // Replace the existing state variables for errors with these enhanced ones
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

  // Add these validation functions directly in the file, after the getlocation function and before handleInputChange

  // GST validation function
  const validateGSTNumber = (gstNumber: string): { isValid: boolean; error: string | null } => {
    // Empty check
    if (!gstNumber) {
      return { isValid: false, error: "GST Number is required" }
    }

    // Basic format check
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    if (!gstRegex.test(gstNumber)) {
      return {
        isValid: false,
        error: "Invalid GST format.",
      }
    }

    // State code validation (01 to 38)
    const stateCode = Number.parseInt(gstNumber.substring(0, 2), 10)
    if (stateCode < 1 || stateCode > 38) {
      return {
        isValid: false,
        error: `Invalid state code: ${stateCode}. Must be between 01 and 38.`,
      }
    }

    // PAN portion validation
    const panPortion = gstNumber.substring(2, 12)
    const panValidation = validatePANNumber(panPortion)
    if (!panValidation.isValid) {
      return {
        isValid: false,
        error: `Invalid PAN portion in GST: ${panValidation.error}`,
      }
    }

    // Entity number validation (13th character)
    const entityNumber = gstNumber.charAt(12)
    if (!/^[1-9A-Z]$/.test(entityNumber)) {
      return {
        isValid: false,
        error: "Invalid entity number (13th character)",
      }
    }

    // Z character validation (14th character)
    if (gstNumber.charAt(13) !== "Z") {
      return {
        isValid: false,
        error: "14th character must be 'Z'",
      }
    }

    return { isValid: true, error: null }
  }

  // PAN validation function
  const validatePANNumber = (panNumber: string): { isValid: boolean; error: string | null } => {
    // Empty check
    if (!panNumber) {
      return { isValid: false, error: "PAN Number is required" }
    }

    // Basic format check
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(panNumber)) {
      return {
        isValid: false,
        error: "Invalid PAN format.",
      }
    }

    // First character validation based on entity type
    const firstChar = panNumber.charAt(0)
    const entityTypes: Record<string, string> = {
      P: "Individual",
      C: "Company",
      H: "HUF (Hindu Undivided Family)",
      A: "Association of Persons (AOP)",
      B: "Body of Individuals (BOI)",
      G: "Government Agency",
      J: "Artificial Juridical Person",
      L: "Local Authority",
      F: "Firm/Limited Liability Partnership",
      T: "Trust",
    }

    if (!Object.keys(entityTypes).includes(firstChar)) {
      return {
        isValid: false,
        error: `Invalid first character: ${firstChar}. Must be one of: ${Object.keys(entityTypes).join(", ")}`,
      }
    }

    return { isValid: true, error: null }
  }

  // Helper function to get entity type from PAN
  const getPANEntityType = (panFirstChar: string): string => {
    const entityTypes: Record<string, string> = {
      P: "Individual",
      C: "Company",
      H: "HUF (Hindu Undivided Family)",
      A: "Association of Persons (AOP)",
      B: "Body of Individuals (BOI)",
      G: "Government Agency",
      J: "Artificial Juridical Person",
      L: "Local Authority",
      F: "Firm/Limited Liability Partnership",
      T: "Trust",
    }

    return entityTypes[panFirstChar] || "Unknown Entity Type"
  }

  // Helper function to get state name from GST state code
  const getGSTStateName = (stateCode: string): string => {
    const states: Record<string, string> = {
      "01": "Jammu & Kashmir",
      "02": "Himachal Pradesh",
      "03": "Punjab",
      "04": "Chandigarh",
      "05": "Uttarakhand",
      "06": "Haryana",
      "07": "Delhi",
      "08": "Rajasthan",
      "09": "Uttar Pradesh",
      "10": "Bihar",
      "11": "Sikkim",
      "12": "Arunachal Pradesh",
      "13": "Nagaland",
      "14": "Manipur",
      "15": "Mizoram",
      "16": "Tripura",
      "17": "Meghalaya",
      "18": "Assam",
      "19": "West Bengal",
      "20": "Jharkhand",
      "21": "Odisha",
      "22": "Chhattisgarh",
      "23": "Madhya Pradesh",
      "24": "Gujarat",
      "26": "Dadra & Nagar Haveli and Daman & Diu",
      "27": "Maharashtra",
      "28": "Andhra Pradesh",
      "29": "Karnataka",
      "30": "Goa",
      "31": "Lakshadweep",
      "32": "Kerala",
      "33": "Tamil Nadu",
      "34": "Puducherry",
      "35": "Andaman & Nicobar Islands",
      "36": "Telangana",
      "37": "Andhra Pradesh (New)",
      "38": "Ladakh",
    }

    return states[stateCode] || "Unknown State"
  }

  // Modify the handleInputChange function to use the imported validation functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate GST number
    if (name === "gstNumber" && value) {
      const gstValidation = validateGSTNumber(value)
      setGstError(gstValidation.error)

      // If valid, set additional info
      if (gstValidation.isValid) {
        const stateCode = value.substring(0, 2)
        setGstInfo({
          stateName: getGSTStateName(stateCode),
        })
      } else {
        setGstInfo(null)
      }
    } else if (name === "gstNumber" && !value) {
      setGstError(null)
      setGstInfo(null)
    }

    // Validate PAN number
    if (name === "panNumber" && value) {
      const panValidation = validatePANNumber(value)
      setPanError(panValidation.error)

      // If valid, set additional info
      if (panValidation.isValid) {
        setPanInfo({
          entityType: getPANEntityType(value.charAt(0)),
        })
      } else {
        setPanInfo(null)
      }
    } else if (name === "panNumber" && !value) {
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

  // Modify the handleSave function to use the imported validation functions
  const handleSave = async () => {
    // Reset errors
    setGstError(null)
    setPanError(null)

    // Validation
    let isValid = true

    // GST validation if registered
    if (isGstRegistered) {
      const gstValidation = validateGSTNumber(formData.gstNumber)
      if (!gstValidation.isValid) {
        setGstError(gstValidation.error)
        isValid = false
      }
    }

    // PAN validation
    const panValidation = validatePANNumber(formData.panNumber)
    if (!panValidation.isValid) {
      setPanError(panValidation.error)
      isValid = false
    }

    if (!isValid) {
      toast.error("Please fix the validation errors before saving")
      return
    }

    try {
      const formDataToSend = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      // Append isGstRegistered
      formDataToSend.append("isGstRegistered", isGstRegistered.toString())

      // Append files if they exist
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

  return (
    <div className=" bg-universal_gray_background pb-10">
      <div className="px-6 gap-3">
        <div className="py-6 gap-1">
          <div className="text-3xl font-semibold text-business_settings_black_text">Your Business Details</div>
          <div className="text-lg font-medium text-business_settings_gray_text">
            An Overview of all your transactions over the year.
          </div>
        </div>
        <div className="rounded-lg bg-universal_white_background flex flex-col p-6 h-auto gap-4">
          <div className="flex gap-3">
            <div
              className="cursor-pointer flex flex-col items-center justify-center p-4 w-[188px] h-[188px] rounded-lg border-dashed border border-business_settings_gray_border"
              onClick={() => businessLogoRef.current?.click()}
            >
              {businessLogoPreview ? (
                <Image
                  src={businessLogoPreview || "/placeholder.svg"}
                  alt="Business Logo"
                  className="w-full h-full object-contain"
                  height={188}
                  width={188}
                />
              ) : (
                <>
                  <div className="">
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
          <div className="flex gap-3">
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
                    onChange={() => setIsGstRegistered(false)}
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
                className={`bg-transparent border ${gstError ? "border-red-500" : "border-business_settings_gray_border"} border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 ${
                  !isGstRegistered ? "cursor-not-allowed" : ""
                }`}
                disabled={!isGstRegistered}
                placeholder="22AAAAA0000A1Z5"
              />
              {gstError && <p className="text-xs text-red-500 mt-1">{gstError}</p>}
              {gstInfo && <div className="text-xs text-green-600 mt-1">State: {gstInfo.stateName}</div>}
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">PAN Number</div>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className={`bg-transparent border ${panError ? "border-red-500" : "border-business_settings_gray_border"} border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1`}
                placeholder="AAAAA0000A"
              />
              {panError && <p className="text-xs text-red-500 mt-1">{panError}</p>}
              {panInfo && <div className="text-xs text-green-600 mt-1">Entity Type: {panInfo.entityType}</div>}
            </div>
          </div>
          <div className="flex gap-3">
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
          <button className="flex justify-end items-center gap-4 " onClick={getlocation}>
            Get Location <FaLocationCrosshairs className="border border-gray text-blue-400" />
          </button>
          <div className="flex gap-3">
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
          <div className="flex">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">Terms & Conditions</div>
              <div className="flex gap-8">
                <textarea
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  className="resize-none bg-transparent border border-business_settings_gray_border border-dashed w-full h-32 rounded-[4px] focus:outline-none p-4"
                />
                <div
                  className="cursor-pointer flex flex-col justify-center items-center bg-transparent border border-business_settings_gray_border border-dashed w-full max-w-[260px] h-32 rounded-[4px] focus:outline-none p-1"
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
          <div className="flex justify-end gap-3">
            <button
              className="bg-universal_white_background px-4 py-[10px] border flex items-center justify-center rounded-lg w-full max-w-[190px]"
              onClick={() => fetchBusinessDetails()}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-sidebar_green_button_background text-universal_white_background px-4 py-[10px] flex items-center justify-center rounded-lg w-full max-w-[190px]"
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

