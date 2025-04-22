import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
 
      <header className="flex h-20 w-full items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
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
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            sign up
          </Link>
        </div>
      </header>
  
      <main className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
          
            <div className="flex flex-col justify-between gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>

                <div className="mt-8 space-y-8">
                  <div className="rounded-lg border border-gray-200 bg-white p-6 ">
                    <h3 className="text-lg font-medium text-gray-900">Customer Support:</h3>
                    <p className="mt-2 text-gray-600">
                      For assistance with your account, billing, or technical issues, please email us at:
                    </p>
                    <div className="mt-3 flex items-center">
                      <Mail className="h-5 w-5 text-emerald-500" />
                      <a href="mailto:info@invoicify.in" className="ml-2 text-emerald-600 hover:underline">
                        info@invoicify.in
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

        
            <div className="rounded-xl bg-white p-8 shadow-md w-auto">
              <h2 className="text-2xl font-semibold text-gray-900">Personal details</h2>
              <p className="mt-2 text-gray-600">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <form className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <select
                    id="subject"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Send Message
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
