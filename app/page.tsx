"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react"
import { Users, Layers, Receipt, FileBarChart } from "lucide-react"

const services = [
  {
    icon: Users,
    title: "Manage Parties",
    description: "Create, send & manage invoices to keep your business running smoothly.",
  },
  {
    icon: Layers,
    title: "Manage Products",
    description: "List and manage numerous product categories effortlessly.",
  },
  {
    icon: Receipt,
    title: "Track Expenses",
    description: "Monitor expenses easily and maintain control of your finances.",
  },
  {
    icon: FileBarChart,
    title: "Generate Reports",
    description: "Our Dashboard provides Real-Time Analytics for you to maximize efficiency.",
  },
]

const testimonials = [
  {
    id: 1,
    name: "Varidh Srivastav",
    role: "Business Owner",
    date: "20 Jun 2024",
    quote:
      "Invoicify has completely transformed how we handle billing. It's simple, efficient, and saves us so much time. A game-changer for our business!",
    image: "/Invoice.png",
  },
  {
    id: 2,
    name: "Dhrubo Balak Sen",
    role: "Business Owner",
    date: "20 Jun 2024",
    quote:
      "Invoicify streamlined our invoicing process overnight. It's intuitive, fast, and has seriously improved our workflow. We can't imagine going back!",
    image: "/Invoice.png",
  },
  {
    id: 3,
    name: "Suhas Hiremat",
    role: "Business Owner",
    date: "20 Jun 2024",
    quote:
      "Using Invoicify has been a breath of fresh air. It's clean, powerful, and just works. Total time-saver and worth every penny.",
    image: "/Invoice.png",
  },
  {
    id: 4,
    name: "Sai Kiran",
    role: "Business Owner",
    date: "20 Jun 2024",
    quote:
      "Billing used to be a headache—now it's a breeze. Invoicify gives us back hours every week. Truly essential for any growing business.",
    image: "/Invoice.png",
  },
]
// @ts-ignore
function useCounter(end, duration = 3000, startValue = 0, shouldStart = false) {
  const [count, setCount] = useState(startValue)
  const countRef = useRef(startValue)
  const timeRef = useRef<number | null>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    // Only start the counter if shouldStart is true and it hasn't already started
    if (shouldStart && !hasStarted.current) {
      hasStarted.current = true
      countRef.current = startValue
      const startTime = Date.now()

      const updateCount = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const currentCount = Math.floor(progress * (end - startValue) + startValue)

        if (countRef.current !== currentCount) {
          countRef.current = currentCount
          setCount(currentCount)
        }

        if (progress < 1) {
          timeRef.current = requestAnimationFrame(updateCount)
        }
      }

      timeRef.current = requestAnimationFrame(updateCount)
    }

    return () => {
      if (timeRef.current) {
        cancelAnimationFrame(timeRef.current)
      }
    }
  }, [end, duration, startValue, shouldStart])

  return count
}

export default function landing() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isStatsVisible, setIsStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const totalSlides = Math.ceil(testimonials.length / 2)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsStatsVisible(true)
          // Once triggered, disconnect the observer
          observer.disconnect()
        }
      },
      { threshold: 0.2 }, // Trigger when at least 20% of the element is visible
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <section className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 sm:w-[28%] h-full bg-gradient-to-b from-[#1a9b73] to-[#0d4d39]" />

        <header className="relative z-10 flex items-center justify-between px-3 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Image src="/Logo.png" alt="" width={35} height={35} />
            <span className="text-xl font-semibold">Invoicify</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-white hover:text-gray-200 transition-colors text-sm sm:text-base">
              <a href="/dashboard">Log In</a>
            </button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base">
              <a href="/dashboard">sign up</a>
            </button>
          </div>
        </header>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-auto min-h-[calc(100vh-76px)] w-full">
          <div className="grid lg:grid-cols-2 items-start h-full">
            <div className="relative py-8 sm:py-12 lg:py-24 max-w-[600px] px-0 sm:px-5 mt-8 sm:mt-20 mx-auto text-center lg:text-left lg:right-11">
              <h1 className="text-3xl sm:text-[40px] tracking-tight text-gray-900 leading-tight font-Inter font-semibold">
                Streamline Your Business with Smart Billing and Management Solutions
              </h1>
              <meta name="description" content="Generate professional invoices, manage expenses, and grow your business with Invoicify" />
              <p className="mt-4 sm:mt-5 text-lg sm:text-[20px] leading-8 text-gray-600">
                Automate invoicing, manage expenses, track sales, and enhance client relationships all in one intuitive
                platform for improved efficiency and growth.
              </p>
              <div className="mt-6 sm:mt-8">
                <button className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  <span>
                    <a href="/dashboard">Get Started Now</a>
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="absolute right-0 top-[76px] bottom-0 w-[55%] hidden md:block">
              <Image
                src="/chart.png"
                alt="Business analytics dashboard with charts"
                fill
                className="object-cover object-left scale-110"
                priority
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl " />
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center gap-4">
          <p className="text-base font-semibold text-gray-500 font-Inter ">BUILT ON YOUR TRUST</p>

          <h1 className="mt-2 text-5xl text-gray-900  font-semibold font-Inter ">
            We've helped businesses
            <br />
            Grow Significantly
          </h1>

          <p className="mt-4 text-xl leading-8 text-gray-600 max-w-2xl mx-auto font-Inter">
            Businesses thrive with smoother operations and faster growth using our solutions.
          </p>

          <div className="h-22" ref={statsRef}>
            <div className="mt-16 grid grid-cols-1 gap-8 font-Inter sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 border-y-[1px] py-8 sm:py-10 border-dashed border-[#869E9D] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,#F0F7F7_24.2%,#F0F7F7_74.85%,rgba(255,255,255,0)_100%)] text-center">
              <div className="flex flex-col gap-y-3">
                <dt className="text-5xl font-semibold tracking-tight text-gray-900">
                  {useCounter(300, 1500, 0, isStatsVisible)}+
                </dt>
                <dd className="text-base leading-7 text-gray-600">Businesses transformed</dd>
              </div>
              <div className="flex flex-col gap-y-3">
                <dt className="text-5xl font-semibold tracking-tight text-gray-900">
                  {useCounter(4, 1500, 1, isStatsVisible)}x
                </dt>
                <dd className="text-base leading-7 text-gray-600">Growth witnessed</dd>
              </div>
              <div className="flex flex-col gap-y-3">
                <dt className="text-5xl font-semibold tracking-tight text-gray-900">
                  {useCounter(95, 1500, 0, isStatsVisible)}%
                </dt>
                <dd className="text-base leading-7 text-gray-600">Customer satisfaction</dd>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white font-Inter">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="pb-10">
            <p className="text-base font-semibold text-gray-600">WHY CHOOSE US?</p>

            <h2 className="mt-2 text-4xl font-semibold   text-[#212626] sm:text-5xl ">
              Invoicify makes your invoicing journey
              <br />
              smooth, efficient, and hassle-free.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col  gap-4 pt-6 pl-8 bg-slate-100 rounded-lg shadow-sm border">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center justify-center gap-2">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19.5" fill="white" strokeWidth="#A3BFBE" />
                    <path
                      d="M26.0234 13V12C26.0234 11.4477 25.5757 11 25.0234 11H16.9377C16.6724 11 16.4181 11.1054 16.2305 11.2929L12.3163 15.2071C12.1288 15.3946 12.0234 15.649 12.0234 15.9142V28C12.0234 28.5523 12.4712 29 13.0234 29H25.0234C25.5757 29 26.0234 28.5523 26.0234 28V23M17.0234 11V15C17.0234 15.5523 16.5757 16 16.0234 16H12.0234M23.4064 16.772L26.1514 19.518M27.3664 15.612C27.5605 15.8058 27.7144 16.036 27.8194 16.2893C27.9244 16.5427 27.9785 16.8142 27.9785 17.0885C27.9785 17.3627 27.9244 17.6343 27.8194 17.8876C27.7144 18.141 27.5605 18.3712 27.3664 18.565L20.7164 25.211L17.0234 25.95L17.7624 22.258L24.4084 15.612C24.6024 15.4172 24.8328 15.2626 25.0866 15.1572C25.3404 15.0517 25.6126 14.9974 25.8874 14.9974C26.1623 14.9974 26.4344 15.0517 26.6882 15.1572C26.942 15.2626 27.1725 15.4172 27.3664 15.612Z"
                      stroke="#1EB386"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Create Invoice</h3>
                <p className="text-gray-600 text-left">
                  Create, send & manage invoices to keep your business running smoothly.
                </p>
              </div>
              <div className="w-full flex items-end justify-end">
                <img src="/Create Invoice.png" alt="img" className=" w-full p-0" />
              </div>
            </div>
            <div className="flex flex-col  gap-4 pt-6 pl-8 bg-slate-100 rounded-lg shadow-sm border">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center justify-center gap-2">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19.5" fill="white" strokeWidth="#A3BFBE" />
                    <path
                      d="M18 11V15C18 15.5523 17.5523 16 17 16H13M17 22L19 24L23 20M27 12V28C27 28.5523 26.5523 29 26 29H14C13.4477 29 13 28.5523 13 28V15.9142C13 15.649 13.1054 15.3946 13.2929 15.2071L17.2071 11.2929C17.3946 11.1054 17.649 11 17.9142 11H26C26.5523 11 27 11.4477 27 12Z"
                      stroke="#1EB386"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Manage Invoice</h3>
                <p className="text-gray-600 text-left">
                  Create, send & manage invoices to keep your business running smoothly.
                </p>
              </div>
              <div className="w-full flex items-end justify-end">
                <img src="/Data Analytics.png" alt="sdch" className=" w-full p-0" />
              </div>
            </div>
            <div className="flex flex-col  gap-4 pt-6 pl-8 bg-slate-100 rounded-lg shadow-sm border">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center justify-center gap-2">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19.5" fill="white" strokeWidth="#A3BFBE" />
                    <path
                      d="M12 12.25V26.75C12 27.3023 12.4477 27.75 13 27.75H28M15 21.75L19 17.75L23 21.75L28 16.75M28 16.75H24.793M28 16.75V19.957"
                      stroke="#1EB386"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Hassle free</h3>
                <p className="text-gray-600 text-left">
                  Create, send & manage invoices to keep your business running smoothly.
                </p>
              </div>
              <div className="w-full flex items-end justify-end">
                <img src="/Manage Invoices.png" alt="sdch" className=" w-full p-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 font-Inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1fr,2fr] gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-sm font-medium tracking-wide text-[#667085] uppercase">OUR SERVICES</h2>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#212626]">
              Simplify running your business with Invoicify
            </h3>
            <p className="text-lg md:text-xl text-[#667085]">
              Explore our other Features to streamline your Billing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {services.map((service, index) => (
              <div key={index} className="space-y-4 text-center md:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#d8f6e5] flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-[#09857e]" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#212626]">{service.title}</h4>
                </div>
                <p className="text-[#667085] pl-0 sm:pl-16">{service.description}</p>
                <div className="border-b border-dashed border-[#869e9d] pt-2 opacity-50"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-16 md:py-24 lg:py-[100px] px-4 sm:px-8 md:px-16 lg:px-[100px] text-white flex flex-col items-center justify-center text-2xl sm:text-3xl md:text-4xl text-center bg-[linear-gradient(92deg,#1BA078_10.35%,#0A3A2C_112.5%)] font-Inter">
        <div className="w-full max-w-7xl mx-auto">
          <p>
            An <span className="font-bold">ALL-in-ONE</span> billing and business management{" "}
            <span className="font-bold">solution,</span> tailored to empower small and medium{" "}
            <span className="font-bold">businesses.</span>
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <Image
              src="/MultipleBusiness.png"
              alt="Business management dashboard interface"
              width={600}
              height={500}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-8 md:space-y-10 order-1 md:order-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl">
              Manage multiple businesses on a single platform
            </h2>

            <div className="space-y-10">
              {[
                {
                  number: 1,
                  title: "Easy Login",
                  description: "Securely access your account with a simple login steps.",
                },
                {
                  number: 2,
                  title: "Create Businesses",
                  description: "Set up new business profiles quickly and effortlessly.",
                },
                {
                  number: 3,
                  title: "Manage Multiple Businesses",
                  description: "Seamlessly switch between businesses and manage all in one app.",
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-6 relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center relative z-10">
                    <span className="text-emerald-500 font-semibold text-xl animate-pulse">{step.number}</span>
                  </div>

                  {/* Animated vertical line connecting steps */}
                  {index < 2 && (
                    <div className="absolute left-6 top-12 w-0.5 h-10 bg-gradient-to-b from-emerald-500 to-emerald-100 transform -translate-x-1/2">
                      <div className="absolute w-full h-1/2 bg-emerald-500 animate-pulse"></div>
                    </div>
                  )}

                  <div className="pt-2">
                    <h3 className="text-xl font-semibold mb-1">
                      {step.title} <span className="font-normal text-gray-600">— {step.description}</span>
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-lg font-medium text-gray-600 mb-2">CLIENT TESTIMONIALS</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-12">What our users are saying</h3>

          <div className="relative px-4">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0 flex flex-col sm:flex-row gap-6 justify-center px-0 sm:px-4"
                  >
                    {testimonials.slice(slideIndex * 2, slideIndex * 2 + 2).map((testimonial) => (
                      <div key={testimonial.id} className="w-full max-w-md mb-6 sm:mb-0">
                        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border h-full">
                          <div className="flex items-center gap-3 mb-6">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                              <p className="text-gray-600 text-sm">{testimonial.role}</p>
                            </div>
                            <div className="ml-auto">
                              <p className="text-gray-500 text-sm">{testimonial.date}</p>
                            </div>
                          </div>
                          <div className="border-[1px] border-dashed mb-4"></div>
                          <blockquote className="text-gray-700 text-base sm:text-lg text-left">
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0 sm:-translate-x-4 bg-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 sm:translate-x-4 bg-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-emerald-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-emerald-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                  Start using Invoicify today
                </h2>
                <p className="mt-4 text-lg text-gray-600">14 day free trial, No credit card required.</p>
                <button className="mt-8 group inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  <span>
                    <a href="/dashboard">Get Started Now</a>
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <div className="relative h-[300px] lg:h-[400px] hidden sm:block">
                <Image src="/cc.png" alt="Invoicify dashboard interface" fill className="object-contain" priority />
              </div>
            </div>
          </div>

          <div className="py-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <Image src="/Logo.png" alt="Invoicify" width={35} height={35} />
                <span className="text-xl font-semibold">Invoicify</span>
              </div>

              {/* <nav> */}
              {/* <ul className="flex items-center gap-8 text-gray-600">
                  <li>
                    <Link href="#" className="hover:text-gray-900 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-gray-900 transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-gray-900 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-gray-900 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav> */}

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Link
                  href="https://www.facebook.com/minesh.patel.146"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/minesh-h-patel-70659515a/"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/task_manager.___/"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <p>© 2024 Invoicify Inc. All rights reserved</p>
              <div className="flex items-center gap-6">
                <Link href="#" className="hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
