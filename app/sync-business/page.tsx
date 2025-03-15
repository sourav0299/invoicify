"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import axios from "axios"
import { FaLocationCrosshairs } from "react-icons/fa6"

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

    // Validation states
    const [errors, setErrors] = useState({
        gstNumber: "",
        panNumber: "",
    })
    const [touched, setTouched] = useState({
        gstNumber: false,
        panNumber: false,
    })

    useEffect(() => {
        fetchBusinessDetails()
    }, [])

    useEffect(() => {
        return () => {
            if (businessLogoPreview) URL.revokeObjectURL(businessLogoPreview)
            if (signaturePreview) URL.revokeObjectURL(signaturePreview)
        }
    }, [businessLogoPreview, signaturePreview])

    // Validate GST Number
    const validateGSTNumber = (gstNumber: string): boolean => {
        // GST Number format: 22AAAAA0000A1Z5 (15 characters)
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
        return gstRegex.test(gstNumber)
    }

    // Validate PAN Number
    const validatePANNumber = (panNumber: string): boolean => {
        // PAN Number format: AAAAA0000A (10 characters)
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
        return panRegex.test(panNumber)
    }

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

        // Validate on change for GST and PAN
        if (name === "gstNumber" && isGstRegistered) {
            if (value && !validateGSTNumber(value)) {
                setErrors((prev) => ({ ...prev, gstNumber: "Invalid GST Number format. Should be like: 22AAAAA0000A1Z5" }))
            } else {
                setErrors((prev) => ({ ...prev, gstNumber: "" }))
            }
        }

        if (name === "panNumber") {
            if (value && !validatePANNumber(value)) {
                setErrors((prev) => ({ ...prev, panNumber: "Invalid PAN Number format. Should be like: AAAAA0000A" }))
            } else {
                setErrors((prev) => ({ ...prev, panNumber: "" }))
            }
        }
    }

    const handleBlur = (field: "gstNumber" | "panNumber") => {
        setTouched((prev) => ({ ...prev, [field]: true }))

        // Validate on blur
        if (field === "gstNumber" && isGstRegistered) {
            const value = formData.gstNumber
            if (value && !validateGSTNumber(value)) {
                setErrors((prev) => ({ ...prev, gstNumber: "Invalid GST Number format. Should be like: 22AAAAA0000A1Z5" }))
            } else if (!value && isGstRegistered) {
                setErrors((prev) => ({ ...prev, gstNumber: "GST Number is required" }))
            } else {
                setErrors((prev) => ({ ...prev, gstNumber: "" }))
            }
        }

        if (field === "panNumber") {
            const value = formData.panNumber
            if (value && !validatePANNumber(value)) {
                setErrors((prev) => ({ ...prev, panNumber: "Invalid PAN Number format. Should be like: AAAAA0000A" }))
            } else if (!value) {
                setErrors((prev) => ({ ...prev, panNumber: "PAN Number is required" }))
            } else {
                setErrors((prev) => ({ ...prev, panNumber: "" }))
            }
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

    const validateForm = (): boolean => {
        let isValid = true
        const newErrors = { ...errors }

        // Validate GST Number if registered
        if (isGstRegistered) {
            if (!formData.gstNumber) {
                newErrors.gstNumber = "GST Number is required"
                isValid = false
            } else if (!validateGSTNumber(formData.gstNumber)) {
                newErrors.gstNumber = "Invalid GST Number format. Should be like: 22AAAAA0000A1Z5"
                isValid = false
            } else {
                newErrors.gstNumber = ""
            }
        } else {
            newErrors.gstNumber = ""
        }

        // Validate PAN Number
        if (!formData.panNumber) {
            newErrors.panNumber = "PAN Number is required"
            isValid = false
        } else if (!validatePANNumber(formData.panNumber)) {
            newErrors.panNumber = "Invalid PAN Number format. Should be like: AAAAA0000A"
            isValid = false
        } else {
            newErrors.panNumber = ""
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSave = async () => {
        // Mark all fields as touched
        setTouched({
            gstNumber: true,
            panNumber: true,
        })

        // Validate form before submission
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting")
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
                toast.success("Form submitted successfully")

                // Optionally, you can refresh the data here
                await fetchBusinessDetails()
            } else {
                const errorData = await response.json()
                console.log("Failed to save business details:", errorData.error)
                toast.error("Failed to save business details")
            }
        } catch (error) {
            console.log("Error saving business details:", error)
            toast.error("An error occurred while saving")
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-[#fafafa] px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col items-center mb-6 sm:mb-8">
                <div className="text-[#1eb386] mb-2">
                    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.500977" y="16.5" width="7.99999" height="7.99999" fill="#1EB386" />
                        <rect x="24.501" y="24.5" width="8" height="7.99999" transform="rotate(180 24.501 24.5)" fill="#1EB386" />
                        <path d="M8.50098 16.5L16.501 8.49998V16.5L8.50098 24.5V16.5Z" fill="#ADEDD2" />
                        <path d="M16.501 24.5L8.50099 32.5L8.50099 24.5L16.501 16.5L16.501 24.5Z" fill="#77DEB8" />
                        <path d="M0.500977 16.5L16.5009 0.5V8.49999L8.50096 16.5H0.500977Z" fill="#77DEB8" />
                        <path d="M24.501 24.5L8.501 40.5L8.501 32.5L16.501 24.5L24.501 24.5Z" fill="#40C79A" />
                    </svg>

                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#212626] mb-1 text-center">
                    Set Up your Business Details
                </h1>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Logo Upload and Business Name */}
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="flex flex-col items-center mb-4 md:mb-0">
                            <div
                                className="cursor-pointer flex flex-col items-center justify-center p-4 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-lg border-dashed border border-[#e0e2e7]"
                                onClick={() => businessLogoRef.current?.click()}
                            >
                                {businessLogoPreview ? (
                                    <Image
                                        src={businessLogoPreview || "/placeholder.svg"}
                                        alt="Business Logo"
                                        className="w-full h-full object-contain"
                                        height={150}
                                        width={150}
                                    />
                                ) : (
                                    <>
                                        <div className="mb-2">
                                            <PhotoIcon />
                                        </div>
                                        <div className="text-xs font-medium text-[#1eb386]">+ Upload Logo</div>
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
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#667085]">Business Name</label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#667085]">Business Type</label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                                    >
                                        <option value="">Select Business Type</option>
                                        <option value="retailer">Retailer</option>
                                        <option value="wholesaler">Wholesaler</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#667085]">Business Registration Type</label>
                                    <select
                                        name="businessRegistrationType"
                                        value={formData.businessRegistrationType}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                                    >
                                        <option value="">Select Registration Type</option>
                                        <option value="private">Private Limited</option>
                                        <option value="public">Public Limited</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GST and PAN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">GST Registered?</label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gstRegistered"
                                        value="yes"
                                        checked={isGstRegistered}
                                        className="text-[#1eb386]"
                                        onChange={() => {
                                            setIsGstRegistered(true)
                                            // Reset GST validation when toggling
                                            if (!isGstRegistered) {
                                                setErrors((prev) => ({ ...prev, gstNumber: "" }))
                                                setTouched((prev) => ({ ...prev, gstNumber: false }))
                                            }
                                        }}
                                    />
                                    <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gstRegistered"
                                        value="no"
                                        checked={!isGstRegistered}
                                        className="text-[#1eb386]"
                                        onChange={() => {
                                            setIsGstRegistered(false)
                                            // Clear GST errors when not registered
                                            setErrors((prev) => ({ ...prev, gstNumber: "" }))
                                        }}
                                    />
                                    <span className="text-sm">No</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">GST Number</label>
                            <input
                                type="text"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur("gstNumber")}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 
                  ${errors.gstNumber && touched.gstNumber ? "border-red-500 focus:ring-red-500" : "border-[#e0e2e7] focus:ring-[#1eb386]"}
                  ${!isGstRegistered ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={!isGstRegistered}
                                placeholder="22AAAAA0000A1Z5"
                            />
                            {errors.gstNumber && touched.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">PAN Number</label>
                            <input
                                type="text"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur("panNumber")}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 
                  ${errors.panNumber && touched.panNumber ? "border-red-500 focus:ring-red-500" : "border-[#e0e2e7] focus:ring-[#1eb386]"}`}
                                placeholder="AAAAA0000A"
                            />
                            {errors.panNumber && touched.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                        </div>
                    </div>

                    {/* Company Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">Company E-mail</label>
                            <input
                                type="email"
                                name="companyEmail"
                                value={formData.companyEmail}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">Company Number</label>
                            <input
                                type="text"
                                name="companyNumber"
                                value={formData.companyNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                            />
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#667085]">Billing Address</label>
                        <textarea
                            name="billingAddress"
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] resize-none h-20 sm:h-24"
                        />
                    </div>

                    {/* Location */}
                    <div className="flex justify-end">
                        <button
                            className="flex items-center gap-2 text-[#1eb386] text-sm py-1 px-2 rounded hover:bg-[#f0f9f6] transition-colors"
                            onClick={getlocation}
                        >
                            Get Location <FaLocationCrosshairs className="text-[#1eb386]" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386]"
                            />
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">Terms & Conditions</label>
                            <textarea
                                name="termsAndConditions"
                                value={formData.termsAndConditions}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-[#e0e2e7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1eb386] resize-none h-28 sm:h-32"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#667085]">Signature</label>
                            <div
                                className="cursor-pointer flex flex-col items-center justify-center p-4 h-28 sm:h-32 rounded-md border-dashed border border-[#e0e2e7]"
                                onClick={() => signatureRef.current?.click()}
                            >
                                {signaturePreview ? (
                                    <Image
                                        src={signaturePreview || "/placeholder.svg"}
                                        alt="Signature"
                                        className="max-w-full max-h-full object-contain"
                                        height={128}
                                        width={200}
                                    />
                                ) : (
                                    <span className="text-sm text-[#1eb386]">+ Upload Signature</span>
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

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
                        <button
                            className="px-4 sm:px-6 py-2 border border-[#e0e2e7] rounded-md text-[#667085] w-full sm:w-auto order-2 sm:order-1"
                            onClick={() => fetchBusinessDetails()}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 sm:px-6 py-2 bg-[#1eb386] text-white rounded-md hover:bg-[#40c79a] transition-colors w-full sm:w-auto order-1 sm:order-2"
                        >
                            Save & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessSettings

