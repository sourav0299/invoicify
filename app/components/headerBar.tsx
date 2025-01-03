"use client"
import React, { useState } from 'react'
import Link from "next/link";

const headerBar = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const toggleMenu = () => {
          setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="w-full ml-2 h-16 flex items-center justify-end p-6 bg-white shadow">
      <div className="flex">
        <div className="">Bell Icon</div>
        <div className="flex cursor-pointer" onClick={toggleMenu}>
          <div className="">Business Photo</div>
          <div className="">Business Name</div>
          <div className="cursor-pointer relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-200 ${
                isMenuOpen ? "transform rotate-180" : ""
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
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-300 ease-in-out">
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
}

export default headerBar