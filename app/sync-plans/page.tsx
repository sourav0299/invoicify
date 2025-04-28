"use client";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import prisma from "../../utils/prisma";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState<number | null>(null);

  const handlePurchase = async (planId: number) => {
    try {
      if (!user) {
        toast.error("Please sign in to purchase a plan");
        return;
      }

      setLoading(planId);
      
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      
      if (!primaryEmail) {
        toast.error("No email address found");
        return;
      }

      // Create subscription using API
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: primaryEmail,
          planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      toast.success("Subscription created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-8 sm:py-12 md:py-16 ">
      <div className="max-w-7xl w-[95%] rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12">
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <svg
              width="36"
              height="41"
              viewBox="0 0 36 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="6.5"
                y="16.5"
                width="7.99999"
                height="7.99999"
                fill="#1EB386"
              />
              <rect
                x="30.5"
                y="24.5"
                width="8"
                height="7.99999"
                transform="rotate(180 30.5 24.5)"
                fill="#1EB386"
              />
              <path
                d="M14.5 16.5L22.5 8.49998V16.5L14.5 24.5V16.5Z"
                fill="#ADEDD2"
              />
              <path
                d="M22.5 24.5L14.5 32.5L14.5 24.5L22.5 16.5L22.5 24.5Z"
                fill="#77DEB8"
              />
              <path
                d="M6.5 16.5L22.5 0.5V8.49999L14.5 16.5H6.5Z"
                fill="#77DEB8"
              />
              <path
                d="M30.5 24.5L14.5 40.5L14.5 32.5L22.5 24.5L30.5 24.5Z"
                fill="#40C79A"
              />
            </svg>

            <span className="text-[#667085] text-lg md:text-xl font-medium">
              Invoicify
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#212626] text-center">
            Choose a Plan
          </h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {/* Essential Plan */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold text-[#212626] mb-1 md:mb-2">
              Essential
            </h2>
            <p className="text-[#667085] text-sm md:text-base mb-4 md:mb-6 whitespace-nowrap min-h-[20px] md:min-h-[24px]">
              Everything you need to get started.
            </p>

            <div className="mb-4 md:mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl md:text-4xl font-bold text-[#212626]">
                  ₹149.00
                </span>
                <span className="ml-2 text-sm md:text-base text-[#667085]">
                  per month
                </span>
              </div>
              <div className="text-[#667085] text-xs md:text-sm mt-1">
                ₹1,788.00/year{" "}
                <span className="text-[#667085]">Billed annually</span>
              </div>
            </div>

            <button
              className="w-full bg-[#1eb386] hover:bg-[#40c79a] text-white py-2.5 md:py-3 rounded-lg font-medium mb-3 md:mb-4"
              onClick={() => handlePurchase(1)}
              disabled={loading === 1}
            >
              {loading === 1 ? "Processing..." : "Purchase"}
            </button>

            <p className="text-center text-[#667085] text-xs md:text-sm mb-6 md:mb-8">
              Comes with 14 days free trial
            </p>

            <div className="space-y-3 md:space-y-4 flex-grow">
              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Manage your </span>
                  <span className="text-[#212626] font-medium">1 Business</span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#212626] font-medium">
                    Single user access
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Create upto </span>
                  <span className="text-[#212626] font-medium">
                    50 Invoices
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">List Upto </span>
                  <span className="text-[#212626] font-medium">
                    100 Products
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">List Upto </span>
                  <span className="text-[#212626] font-medium">20 Parties</span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Generate </span>
                  <span className="text-[#212626] font-medium">
                    Before & After Tax Reports
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <X className="h-4 w-4 md:h-5 md:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Custom Templates</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb] my-5 md:my-6"></div>

            <div className="flex items-start gap-2 md:gap-3">
              <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
              <div className="text-sm md:text-base">
                <span className="text-[#667085]">Auto sync </span>
                <span className="text-[#212626] font-medium">
                  Data across Unlimited Devices
                </span>
              </div>
            </div>
          </div>

          {/* Elite Plan */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col relative shadow-lg">
            <div className="absolute -top-1 right-6 md:right-8 bg-[#efb346] text-white px-3 md:px-4 py-0.5 md:py-1 rounded-b-md flex items-center gap-1 text-xs md:text-sm">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M5 12L10 17L20 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Most Popular
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-[#212626] mb-1 md:mb-2">
              Elite
            </h2>
            <p className="text-[#667085] text-sm md:text-base mb-4 md:mb-6 whitespace-nowrap min-h-[20px] md:min-h-[24px]">
              More benefits, more flexibility.
            </p>

            <div className="mb-4 md:mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl md:text-4xl font-bold text-[#212626]">
                  ₹249.00
                </span>
                <span className="ml-2 text-sm md:text-base text-[#667085]">
                  per month
                </span>
              </div>
              <div className="text-[#667085] text-xs md:text-sm mt-1">
                ₹2,988.00/year{" "}
                <span className="text-[#667085]">Billed annually</span>
              </div>
            </div>

            <button
              className="w-full bg-[#1eb386] hover:bg-[#40c79a] text-white py-2.5 md:py-3 rounded-lg font-medium mb-3 md:mb-4"
              onClick={() => handlePurchase(2)}
              disabled={loading === 2}
            >
              {loading === 2 ? "Processing..." : "Purchase"}
            </button>

            <p className="text-center text-[#667085] text-xs md:text-sm mb-6 md:mb-8">
              Comes with 14 days free trial
            </p>

            <div className="space-y-3 md:space-y-4 flex-grow">
              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Manage upto </span>
                  <span className="text-[#212626] font-medium">
                    2 Businesses
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Access for </span>
                  <span className="text-[#212626] font-medium">4 Users</span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Create upto </span>
                  <span className="text-[#212626] font-medium">
                    100 Invoices
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">List Upto </span>
                  <span className="text-[#212626] font-medium">
                    200 Products
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">List Upto </span>
                  <span className="text-[#212626] font-medium">50 Parties</span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Generate </span>
                  <span className="text-[#212626] font-medium">
                    Multiple Category Reports
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#212626] font-medium">
                    Custom Templates
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb] my-5 md:my-6"></div>

            <div className="flex items-start gap-2 md:gap-3">
              <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
              <div className="text-sm md:text-base">
                <span className="text-[#667085]">Auto sync </span>
                <span className="text-[#212626] font-medium">
                  Data across Unlimited Devices
                </span>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col shadow-lg sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl md:text-2xl font-semibold text-[#212626] mb-1 md:mb-2">
              Enterprise
            </h2>
            <p className="text-[#667085] text-sm md:text-base mb-4 md:mb-6 whitespace-nowrap min-h-[20px] md:min-h-[24px]">
              Unlimited benefits for unlimited growth.
            </p>

            <div className="mb-4 md:mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl md:text-4xl font-bold text-[#212626]">
                  Contact Us
                </span>
                <span className="ml-2 text-[#667085]"></span>
              </div>
              <div className="text-[#667085] text-xs md:text-sm mt-1">
                Get in touch for a tailored price quote.
              </div>
            </div>

            <button
              className="w-full bg-[#1eb386] hover:bg-[#40c79a] text-white py-2.5 md:py-3 rounded-lg font-medium mb-3 md:mb-4"
              onClick={() => (window.location.href = "/contact")}
            >
              Get a Quote
            </button>

            <p className="text-center text-[#667085] text-xs md:text-sm mb-6 md:mb-8">
              Comes with 14 days free trial
            </p>

            <div className="space-y-3 md:space-y-4 flex-grow">
              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Manage upto </span>
                  <span className="text-[#212626] font-medium">
                    5 Businesses
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#212626] font-medium">
                    Unlimited User Access
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#212626] font-medium">
                    Unlimited Invoices
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#212626] font-medium">
                    Unlimited Products
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#212626] font-medium">
                    Unlimited Parties
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#667085]">Generate </span>
                  <span className="text-[#212626] font-medium">
                    Multiple Category Reports
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
                <div className="text-sm md:text-base">
                  <span className="text-[#212626] font-medium">
                    Custom Templates
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb] my-5 md:my-6"></div>

            <div className="flex items-start gap-2 md:gap-3">
              <Check className="h-4 w-4 md:h-5 md:w-5 text-[#1eb386] mt-0.5 flex-shrink-0" />
              <div className="text-sm md:text-base">
                <span className="text-[#667085]">Auto sync </span>
                <span className="text-[#212626] font-medium">
                  Data across Unlimited Devices
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
