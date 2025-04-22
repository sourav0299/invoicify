"use client"

import type React from "react"

import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Message sent successfully!", {
      duration: 5000,
      position: "top-center",
      style: {
        background: "#ffffff",
        color: "#000000",
        // border: "1px solid #10b981",
      },
    })

    if (formRef.current) {
      formRef.current.reset()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <Toaster />
      <header className="flex h-20 w-full items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 pl-2 sm:pl-4 md:px-9">
          <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="16" width="7.99999" height="7.99999" fill="#1EB386" />
            <rect x="24" y="24" width="8" height="7.99999" transform="rotate(180 24 24)" fill="#1EB386" />
            <path d="M8 16L16 8V16L8 24V16Z" fill="#ADEDD2" />
            <path d="M16 24L8.00001 32L8.00001 24L16 16L16 24Z" fill="#77DEB8" />
            <path d="M0 16L16 0V7.99999L7.99999 16H0Z" fill="#77DEB8" />
            <path d="M24 24L8.00002 40L8.00002 32L16 24L24 24Z" fill="#40C79A" />
          </svg>

          <span className="text-xl font-semibold">Invoicify</span>
        </Link>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-6 md:py-8 lg:py-10">
        <div className="w-full">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-between gap-6 px-0 sm:px-4 md:px-12">
              <div className="w-full">
                <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>

                <div className="mt-6 space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 w-full">
                    <h3 className="text-lg font-medium text-gray-900">Customer Support:</h3>
                    <p className="mt-2 text-gray-600">
                      For assistance with your account, billing, or technical issues, please email us at:
                    </p>
                    <div className="mt-3 flex items-center">
                      <Mail className="h-5 w-5 text-emerald-500" />
                      <a href="mailto:info@invoicify.in" className="ml-2 text-emerald-600 hover:underline">
                        mineshpatel029@gmail.com
                      </a>
                    </div>
                    <p className="mt-2 text-gray-600">or call us at:</p>
                    <div className="mt-1 flex items-center">
                      <Phone className="h-5 w-5 text-emerald-500" />
                      <a href="tel:7619351868" className="ml-2 text-emerald-600 hover:underline">
                        +91 7619351868
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 sm:p-8 w-full border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">Personal details</h2>
              <p className="mt-2 text-gray-600">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <form ref={formRef} className="mt-6 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <select
                    id="subject"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-sidebar_green_button_background h-12 text-universal_white_background px-4 py-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
