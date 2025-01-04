"use client"
import React, { useState } from "react";
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
                  className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                />
              </div>
              <div className="flex w-full gap-3">
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    Buisness Type
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                  />
                </div>
                <div className="flex flex-col w-full bg-universal_gray_background p-5 rounded-lg gap-1">
                  <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                    Business Registration Type
                  </div>
                  <input
                    type="text"
                    className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
                  />
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
                    className="custom-radio h-4 w-4 "
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
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Company Number
              </div>
              <input
                type="text"
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Billing Address
              </div>
              <textarea className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-24 rounded-[4px] focus:outline-none p-1 resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                State
              </div>
              <input
                type="text"
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                Pincode
              </div>
              <input
                type="text"
                className="bg-transparent border border-business_settings_gray_border border-dashed w-full h-8 rounded-[4px] focus:outline-none p-1"
              />
            </div>
            <div className="p-5 bg-universal_gray_background rounded-lg w-full gap-1">
              <div className="bg-transparent w-full text-xs text-sidebar_black_text">
                City
              </div>
              <input
                type="text"
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
                <textarea className="resize-none bg-transparent border border-business_settings_gray_border border-dashed w-full h-32 rounded-[4px] focus:outline-none p-4" />
                <div className="cursor-pointer flex justify-center items-center bg-transparent border border-business_settings_gray_border border-dashed w-full max-w-[260px] h-32 rounded-[4px] focus:outline-none p-1">
                  <span className="text-sidebar_green_button_background">
                    + Upload Signature
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="bg-universal_white_background px-4 py-[10px] border flex items-center justify-center rounded-lg w-full max-w-[190px]">
              Cancel
            </button>
            <button className="bg-sidebar_green_button_background text-universal_white_background px-4 py-[10px] flex items-center justify-center rounded-lg w-full max-w-[190px]">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;
