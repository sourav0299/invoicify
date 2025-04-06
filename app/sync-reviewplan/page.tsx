"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export default function SubscriptionReview() {
    const [paymentFrequency, setPaymentFrequency] = useState<"monthly" | "annually">("monthly")

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] p-2 sm:p-4">
            <div className="w-full max-w-[1200px] rounded-xl p-4 sm:p-6 md:p-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 sm:h-8 sm:w-8">
                            <svg width="36" height="41" viewBox="0 0 36 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6.5" y="16.5" width="7.99999" height="7.99999" fill="#1EB386" />
                                <rect x="30.5" y="24.5" width="8" height="7.99999" transform="rotate(180 30.5 24.5)" fill="#1EB386" />
                                <path d="M14.5 16.5L22.5 8.49998V16.5L14.5 24.5V16.5Z" fill="#ADEDD2" />
                                <path d="M22.5 24.5L14.5 32.5L14.5 24.5L22.5 16.5L22.5 24.5Z" fill="#77DEB8" />
                                <path d="M6.5 16.5L22.5 0.5V8.49999L14.5 16.5H6.5Z" fill="#77DEB8" />
                                <path d="M30.5 24.5L14.5 40.5L14.5 32.5L22.5 24.5L30.5 24.5Z" fill="#40C79A" />
                            </svg>

                        </div>
                        <h1 className="text-lg font-medium text-[#667085] sm:text-xl">Invoicify</h1>
                    </div>
                    <h2 className="mt-2 text-center text-2xl font-semibold text-[#212626] sm:mt-4 sm:text-3xl">
                        Review Your Plan Purchase
                    </h2>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:mt-10 md:gap-6 lg:grid-cols-2">
                     {/* Plan Details  */}
                    <div className="relative rounded-lg border border-[#d9d9d9] bg-white p-4 sm:p-6">
                        <p className="mb-4 text-base font-medium text-[#212626] sm:text-lg">You are signing up for:</p>

                        <div className="relative">
                            <div className="absolute -left-4 top-0 sm:-left-6">
                                <div className="relative h-8 bg-[#efb346] pl-4 pr-6 pt-1.5 text-sm text-white sm:h-10 sm:pl-6 sm:pr-8 sm:pt-2 sm:text-base">
                                    <span className="font-medium">14 days Free Trial</span>
                                    <div className="absolute -right-[10px] top-0 h-0 w-0 border-b-[8px] border-l-[10px] border-t-[8px] border-b-transparent border-l-[#efb346] border-t-transparent sm:-right-[12px] sm:border-b-[10px] sm:border-l-[12px] sm:border-t-[10px]"></div>
                                </div>
                            </div>
                        </div>

                        <h3 className="mt-12 text-xl font-semibold text-[#1eb386] sm:mt-16 sm:text-2xl">Elite Subscription Plan</h3>

                        <ul className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                            <li className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                                <div className="text-sm sm:text-base">
                                    <span className="text-[#667085]">Manage upto </span>
                                    <span className="font-semibold text-[#212626]">2 Businesses</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                                <div className="text-sm sm:text-base">
                                    <span className="text-[#667085]">Access for </span>
                                    <span className="font-semibold text-[#212626]">4 Users</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                                <div className="text-sm sm:text-base">
                                    <span className="text-[#667085]">Create upto </span>
                                    <span className="font-semibold text-[#212626]">100 Invoices</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                                <div className="text-sm sm:text-base">
                                    <span className="text-[#667085]">List Upto </span>
                                    <span className="font-semibold text-[#212626]">200 Products</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                                <div className="text-sm sm:text-base">
                                    <span className="text-[#667085]">List Upto </span>
                                    <span className="font-semibold text-[#212626]">50 Parties</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                                <div className="text-sm sm:text-base">
                                    <span className="text-[#667085]">Generate </span>
                                    <span className="font-semibold text-[#212626]">Multiple Category Reports</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                                <div className="text-sm sm:text-base">
                                    <span className="font-semibold text-[#212626]">Custom Templates</span>
                                </div>
                            </li>
                        </ul>

                        <div className="my-4 h-px bg-[#d9d9d9] sm:my-6"></div>

                        <div className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1eb386] sm:h-5 sm:w-5" />
                            <div className="text-sm sm:text-base">
                                <span className="text-[#667085]">Auto sync </span>
                                <span className="font-semibold text-[#212626]">Data across Unlimited Devices</span>
                            </div>
                        </div>
                    </div>

                     {/* Pricing Details  */}
                    <div className="rounded-lg border border-[#d9d9d9] bg-white p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                            <h3 className="text-3xl font-bold text-[#212626] sm:text-4xl">₹249.00</h3>
                            <span className="text-base text-[#667085] sm:text-lg">per month</span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                            <span className="font-medium text-[#212626] text-sm sm:text-base">₹2,988.00/year</span>
                            <span className="text-xs text-[#667085] sm:text-sm">Billed annualy</span>
                        </div>

                        <div className="mt-6 space-y-3 text-sm sm:mt-8 sm:space-y-4 sm:text-base">
                            <div className="flex items-center justify-between">
                                <span className="text-[#212626]">Subtotal</span>
                                <span className="font-medium text-[#212626]">₹2988.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#212626]">GST 18%</span>
                                <span className="font-medium text-[#212626]">₹000.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#1eb386]">14 days Free trial</span>
                                <span className="font-medium text-[#1eb386]">-₹000.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-[#212626]">Due Now</span>
                                <span className="font-medium text-[#212626]">₹0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#212626]">Next Billing Due Date</span>
                                <span className="font-medium text-[#212626]">4 March, 2024</span>
                            </div>
                        </div>

                        <div className="my-4 h-px bg-[#d9d9d9] sm:my-6"></div>

                        <div className="space-y-3 text-sm sm:space-y-4 sm:text-base">
                            <label className="flex items-center gap-2 cursor-pointer sm:gap-3">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="payment-frequency"
                                        value="monthly"
                                        checked={paymentFrequency === "monthly"}
                                        onChange={() => setPaymentFrequency("monthly")}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 sm:h-6 sm:w-6 ${paymentFrequency === "monthly" ? "border-[#1eb386] bg-[#1eb386]" : "border-[#d9d9d9]"}`}
                                    >
                                        {paymentFrequency === "monthly" && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-white sm:h-2 sm:w-2"></div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[#212626]">Pay Monthly</span>
                                <span className="ml-auto font-medium text-[#212626]">₹000.00/month</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer sm:gap-3">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="payment-frequency"
                                        value="annually"
                                        checked={paymentFrequency === "annually"}
                                        onChange={() => setPaymentFrequency("annually")}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 sm:h-6 sm:w-6 ${paymentFrequency === "annually" ? "border-[#1eb386] bg-[#1eb386]" : "border-[#d9d9d9]"}`}
                                    >
                                        {paymentFrequency === "annually" && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-white sm:h-2 sm:w-2"></div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[#212626]">Pay Annually</span>
                                <span className="ml-auto font-medium text-[#212626]">₹000.00/year</span>
                            </label>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <p className="text-[10px] leading-relaxed text-[#667085] sm:text-xs">
                                By clicking "Agree and subscribe," you agree to the following: You will be charged after the trial ends
                                according to your chosen plan. At the end of your one-year term, your subscription will automatically
                                renew annually until you cancel (price subject to change. Cancel before your trial ends and you will not
                                be charged. Cancel anytime via Invoicify Account or Customer Support . You also agree to the{" "}
                                <span className="text-[#1eb386]">Terms of Use</span> and the{" "}
                                <span className="text-[#1eb386]">Subscription and Cancellation Terms</span>
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                            <button className="w-full rounded-md border border-[#d9d9d9] bg-white px-4 py-2 text-sm text-[#212626] transition hover:bg-gray-50 sm:flex-1 sm:px-6 sm:py-2.5 sm:text-base">
                                Cancel
                            </button>
                            <button className="w-full rounded-md bg-[#1eb386] px-4 py-2 text-sm text-white transition hover:bg-[#40c79a] sm:flex-1 sm:px-6 sm:py-2.5 sm:text-base">
                                Agree & Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

