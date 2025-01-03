"use client";
import React, { useState } from "react";
import Link from "next/link";

interface DropDownIconProps {
  isOpen: boolean;
}

const DropDownIcon: React.FC<DropDownIconProps> = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform duration-200 ${
      isOpen ? "transform rotate-180" : ""
    }`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const BellIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="22"
    viewBox="0 0 18 22"
    fill="none"
  >
    <path
      d="M9.00034 3.62775V1M9.00034 3.62775C10.5393 3.68686 11.995 4.3423 13.0593 5.45542C14.1237 6.56854 14.7134 8.05204 14.7036 9.59212V11.5921C14.7036 14.2432 16.778 14.9054 16.778 16.2309C16.778 16.8898 16.778 17.6665 16.1803 17.6665H1.82043C1.22266 17.6665 1.22266 16.8898 1.22266 16.2309C1.22266 14.9054 3.29708 14.2432 3.29708 11.5921V9.59212C3.28729 8.05204 3.87695 6.56854 4.94134 5.45542C6.00573 4.3423 7.46136 3.68686 9.00034 3.62775ZM5.37055 17.6665C5.475 18.6131 5.7104 19.3778 6.41978 20.0132C7.12915 20.6486 8.04801 21 9.00034 21C9.95268 21 10.8715 20.6486 11.5809 20.0132C12.2903 19.3778 12.9549 18.6131 13.0593 17.6665H5.37055Z"
      stroke="#667085"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeaderBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-16 flex items-center justify-end p-6 bg-white shadow-sm ml-2">
      <div className="flex items-center space-x-4">
        <div className="cursor-pointer"><BellIcon /></div>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={toggleMenu}
        >
          <div className="">Photo</div>
          <div className="">Business Name</div>
          <div className="relative">
            <DropDownIcon isOpen={isMenuOpen} />
            {isMenuOpen && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-300 ease-in-out">
                <Link
                  href="/edit-business"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Business Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
