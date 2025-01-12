"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";

const PhotoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M3 16L8 9L14 15.5M20.5 18L16 13L11.7143 19M14 10H14.01M4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19Z"
      stroke="#1EB386"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BusinessSettings = () => {
  const [isGstRegistered, setIsGstRegistered] = useState(true);
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
  });

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch("/api/business-details");
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setIsGstRegistered(data.isGstRegistered);
      } else {
        console.log("Failed to fetch business details");
      }
    } catch (error) {
      console.log("Error fetching business details:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const method = formData.businessName ? "PUT" : "POST";
      const response = await fetch("/api/business-details", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          isGstRegistered: isGstRegistered,
        }),
      });

      if (response.ok) {
        console.log("Business details saved successfully");
      } else {
        const errorData = await response.json();
        console.log("Failed to save business details:", errorData.error);
      }
    } catch (error) {
      console.log("Error saving business details:", error);
    }
  };

  return (
    <div className=" bg-universal_gray_background pb-10">
      <div className="px-6 gap-3">
        <div className="py-6 gap-1">
          <div className="text-3xl font-semibold text-business_settings_black_text">
            Your Business Details
          </div>
          <div className="text-lg font-medium text-business_settings_gray_text">
            An Overview of all your transactions over the year.
          </div>
        </div>
        <div className="rounded-lg bg-universal_white_background flex flex-col p-6 h-auto gap-4">
          <div className="flex gap-3">
            <div className="cursor-pointer flex flex-col items-center justify-center p-4 w-[188px] h-[188px] rounded-lg border-dashed border border-business_settings_gray_border">
              <div className="">
                <PhotoIcon />
              </div>
              <div className="text-xs font-medium text-sidebar_green_button_background">
                + Upload Image
              </div>
            </div>
            <div className="flex flex-col w-full gap-6">
              <div className="p-5 bg-universal_gray_background rounded-lg gap-1">
                <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                  Business Name
                </div>
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
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    Business Type
                  </div>
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
              <div className="text-sidebar_black_text text-xs">
                Gst Registered?
              </div>
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
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Gst Number
              </div>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className={`bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1 ${
                  !isGstRegistered ? "cursor-not-allowed" : ""
                }`}
                disabled={!isGstRegistered}
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                PAN Number
              </div>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full max-w-[365px] gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Company E-mail
              </div>
              <input
                type="text"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Company Number
              </div>
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
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Billing Address
              </div>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-24 rounded-[4px] focus:outline-none p-1 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                State
              </div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Pincode
              </div>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                City
              </div>
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
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Terms & Conditions
              </div>
              <div className="flex gap-8">
                <textarea
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  className="resize-none bg-transparent border border-business_settings_gray_border border-dashed w-full h-32 rounded-[4px] focus:outline-none p-4"
                />
                <div className="cursor-pointer flex justify-center items-center bg-transparent border border-business_settings_gray_border border-dashed w-full max-w-[260px] h-32 rounded-[4px] focus:outline-none p-1">
                  <span className="text-sidebar_green_button_background">
                    + Upload Signature
                  </span>
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
  );
};

export default BusinessSettings;
