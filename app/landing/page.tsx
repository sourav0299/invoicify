"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Section,
} from "lucide-react";
import { Users, Layers, Receipt, FileBarChart } from "lucide-react";
const services = [
  {
    icon: Users,
    title: "Manage Parties",
    description:
      "Create, send & manage invoices to keep your business running smoothly.",
  },
  {
    icon: Layers,
    title: "Manage Products",
    description: "List and manage numerous product categories effortlessly.",
  },
  {
    icon: Receipt,
    title: "Track Expenses",
    description:
      "Monitor expenses easily and maintain control of your finances.",
  },
  {
    icon: FileBarChart,
    title: "Generate Reports",
    description:
      "Our Dashboard provides Real-Time Analytics for you to maximize efficiency.",
  },
];
const testimonials = [
  {
    id: 1,
    name: "Ramesh Sharma",
    role: "Business Owner",
    date: "20 Jun 2024",
    quote:
      "Invoicify has completely transformed how we handle billing. It's simple, efficient, and saves us so much time. A game-changer for our business!",
    image: "/Invoice.png",
  },
  {
    id: 2,
    name: "Ramesh Sharma",
    role: "Business Owner",
    date: "20 Jun 2024",
    quote:
      "Invoicify has completely transformed how we handle billing. It's simple, efficient, and saves us so much time. A game-changer for our business!",
    image: "/Invoice.png",
  },
  {
    id: 3,
    name: "Ramesh Sharma",
    role: "Business Owner",
    date: "20 Jun 2024",
    quote:
      "Invoicify has completely transformed how we handle billing. It's simple, efficient, and saves us so much time. A game-changer for our business!",
    image: "/Invoice.png",
  },
];
export default function landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };
  return (
    <>
      <section className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[28%] h-full bg-emerald-500 z-0" />

        <header className="relative z-10 flex items-center justify-between px-3 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Image src="/Logo.png" alt="" width={35} height={35} />
            <span className="text-xl font-semibold">Invoicify</span>
          </div>
          <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-white hover:text-gray-200 transition-colors text-sm sm:text-base">
  <a href="https://easy-ghost-86.accounts.dev/sign-in?redirect_url=https%3A%2F%2Finvoicify.in%2Fdashboard">Log In</a>
</button>
<button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base">
  <a href="https://easy-ghost-86.accounts.dev/sign-in?redirect_url=https%3A%2F%2Finvoicify.in%2Fdashboard">sign up</a>
</button>
          </div>
        </header>

        <div className="relative z-10 px-6 lg:px-8 max-w-7xl mx-auto h-[calc(100vh-76px)]  w-full">
          <div className="grid lg:grid-cols-2 items-start h-full">
            <div className="relative right-11 py-12 lg:py-24 max-w-[600px] px-5 mt-20">
              <h1 className="sm:text-[40px] tracking-tight text-gray-900 leading-tight font-Inter font-semibold">
                Streamline Your Business with Smart Billing and Management
                Solutions
              </h1>
              <p className="mt-5 text-[20px] leading-8 text-gray-600">
                Automate invoicing, manage expenses, track sales, and enhance
                client relationships all in one intuitive platform for improved
                efficiency and growth.
              </p>
              <div className="mt-8">
                <button className="flex gap-2 items-center px-12 py-3 bg-emerald-500 text-white text-lg rounded-lg hover:bg-emerald-600 transition-colors">
                  <span>Get Started Now</span>
                  <ArrowRight />
                </button>
              </div>
            </div>

            <div className="absolute right-0 top-[76px] bottom-0 w-[55%]">
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
          <p className="text-base font-semibold text-gray-500 font-Inter ">
            BUILT ON YOUR TRUST
          </p>

          <h1 className="mt-2 text-5xl text-gray-900  font-semibold font-Inter ">
            We've helped businesses
            <br />
            Grow Significantly
          </h1>

          <p className="mt-4 text-xl leading-8 text-gray-600 max-w-2xl mx-auto font-Inter">
            Businesses thrive with smoother operations and faster growth using
            our solutions.
          </p>

          <div className=" h-22">
            <div className=" mt-16 grid grid-cols-1 gap-10 font-Inter sm:grid-cols-2 lg:grid-cols-3 border-y-[1px] py-10 border-dashed border-[#869E9D] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,#F0F7F7_24.2%,#F0F7F7_74.85%,rgba(255,255,255,0)_100%)]">
              <div className="flex flex-col gap-y-3">
                <dt className="text-5xl font-semibold tracking-tight text-gray-900">
                  300+
                </dt>
                <dd className="text-base leading-7 text-gray-600">
                  Businesses transformed
                </dd>
              </div>
              <div className="flex flex-col gap-y-3">
                <dt className="text-5xl font-semibold tracking-tight text-gray-900">
                  4x
                </dt>
                <dd className="text-base leading-7 text-gray-600">
                  Growth witnessed
                </dd>
              </div>
              <div className="flex flex-col gap-y-3">
                <dt className="text-5xl font-semibold tracking-tight text-gray-900">
                  95%
                </dt>
                <dd className="text-base leading-7 text-gray-600">
                  Customer satisfaction
                </dd>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white font-Inter">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="pb-10">
            <p className="text-base font-semibold text-gray-600">
              WHY CHOOSE US?
            </p>

            <h2 className="mt-2 text-4xl font-semibold   text-[#212626] sm:text-5xl ">
              Invoicify makes your invoicing journey
              <br />
              smooth, efficient, and hassle-free.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col  gap-4 pt-6 pl-8 bg-slate-100 rounded-lg shadow-sm border">
              <div className="flex justify-start flex-col items-start">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="19.5"
                      fill="white"
                      strokeWidth="#A3BFBE"
                    />
                    <path
                      d="M26.0234 13V12C26.0234 11.4477 25.5757 11 25.0234 11H16.9377C16.6724 11 16.4181 11.1054 16.2305 11.2929L12.3163 15.2071C12.1288 15.3946 12.0234 15.649 12.0234 15.9142V28C12.0234 28.5523 12.4712 29 13.0234 29H25.0234C25.5757 29 26.0234 28.5523 26.0234 28V23M17.0234 11V15C17.0234 15.5523 16.5757 16 16.0234 16H12.0234M23.4064 16.772L26.1514 19.518M27.3664 15.612C27.5605 15.8058 27.7144 16.036 27.8194 16.2893C27.9244 16.5427 27.9785 16.8142 27.9785 17.0885C27.9785 17.3627 27.9244 17.6343 27.8194 17.8876C27.7144 18.141 27.5605 18.3712 27.3664 18.565L20.7164 25.211L17.0234 25.95L17.7624 22.258L24.4084 15.612C24.6024 15.4172 24.8328 15.2626 25.0866 15.1572C25.3404 15.0517 25.6126 14.9974 25.8874 14.9974C26.1623 14.9974 26.4344 15.0517 26.6882 15.1572C26.942 15.2626 27.1725 15.4172 27.3664 15.612Z"
                      stroke="#1EB386"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Create Invoice
                </h3>
                <p className="text-gray-600 text-left">
                  Create, send & manage invoices to keep your business running
                  smoothly.
                </p>
              </div>
              <div className="w-full flex items-end justify-end">
                <img src="/Invoice.png" alt="sdch" className=" w-full p-0" />
              </div>
            </div>
            <div className="flex flex-col  gap-4 pt-6 pl-8 bg-slate-100 rounded-lg shadow-sm border">
              <div className="flex justify-start flex-col items-start">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="19.5"
                      fill="white"
                      strokeWidth="#A3BFBE"
                    />
                    <path
                      d="M18 11V15C18 15.5523 17.5523 16 17 16H13M17 22L19 24L23 20M27 12V28C27 28.5523 26.5523 29 26 29H14C13.4477 29 13 28.5523 13 28V15.9142C13 15.649 13.1054 15.3946 13.2929 15.2071L17.2071 11.2929C17.3946 11.1054 17.649 11 17.9142 11H26C26.5523 11 27 11.4477 27 12Z"
                      stroke="#1EB386"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Manage Invoice
                </h3>
                <p className="text-gray-600 text-left">
                  Create, send & manage invoices to keep your business running
                  smoothly.
                </p>
              </div>
              <div className="w-full flex items-end justify-end">
                <img src="/Invoice.png" alt="sdch" className=" w-full p-0" />
              </div>
            </div>
            <div className="flex flex-col  gap-4 pt-6 pl-8 bg-slate-100 rounded-lg shadow-sm border">
              <div className="flex justify-start flex-col items-start">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="19.5"
                      fill="white"
                      strokeWidth="#A3BFBE"
                    />
                    <path
                      d="M12 12.25V26.75C12 27.3023 12.4477 27.75 13 27.75H28M15 21.75L19 17.75L23 21.75L28 16.75M28 16.75H24.793M28 16.75V19.957"
                      stroke="#1EB386"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Hassle free
                </h3>
                <p className="text-gray-600 text-left">
                  Create, send & manage invoices to keep your business running
                  smoothly.
                </p>
              </div>
              <div className="w-full flex items-end justify-end">
                <img src="/Invoice.png" alt="sdch" className=" w-full p-0" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-row font-Inter">
        <div className="space-y-4 mb-12">
          <h2 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
            OUR SERVICES
          </h2>
          <h3 className="text-4xl font-semibold tracking-tight text-gray-900">
            Simplify running your business with Invoicify
          </h3>
          <p className="text-xl text-gray-600">
            Explore our other Features to streamline your Billing needs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((feature, index) => (
            <div key={index} className="flex gap-4 flex-col">
              <div className="space-y-2 flex flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[#E5F5F0] flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[#09857e]" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h4>
              </div>
              <div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-[100px] px-[100px] text-white flex items-center text-4xl text-center bg-[linear-gradient(92deg,#1BA078_10.35%,#0A3A2C_112.5%)] font-Inter">
        <div className="max-w-7xl">
          <p>
            An
            <span className="font-bold">ALL-in-ONE</span>
            billing and business management
            <span className="font-bold">solution,</span>
            tailored to empower small and medium
            <span className="font-bold">businesses.</span>
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl">
          <div className="relative">
            <Image
              src="/Invoice.png"
              alt="Business management dashboard interface"
              width={600}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="space-y-10">
            <h2 className="text-2xl font-bold tracking-tight lg:text-4xl text-right">
              Manage multiple businesses on a single platform
            </h2>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <span className="text-emerald-500 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Easy Login -{" "}
                    <span className="text-gray-600 dark:text-gray-400 font-normal">
                      Securely access your account with a simple login steps.
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <span className="text-emerald-500 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Create Businesses -
                    <span className="text-gray-600 dark:text-gray-400 font-normal">
                      Set up new business profiles quickly and effortlessly.
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <span className="text-emerald-500 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Manage Multiple Businesses -
                    <span className="text-gray-600 dark:text-gray-400 font-normal">
                      Seamlessly switch between businesses and manage all in one
                      app.
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            CLIENT TESTIMONIALS
          </h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-12">
            What our users are saying
          </h3>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4 "
                  >
                    <div className="bg-white rounded-lg p-8 shadow-sm border max-w-2xl mx-auto w-[475px]">
                      <div className="flex items-center gap-3 mb-6">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <p className="text-gray-500 text-sm">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="border-[1px] border-dashed "></div>
                      <blockquote className="text-gray-700 text-lg text-left">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
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
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                  Start using Invoicify today
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  14 day free trial, No credit card required.
                </p>
                <button className="mt-8 group inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Get Started Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <div className="relative h-[300px] lg:h-[400px]">
                <Image
                  src="/cc.png"
                  alt="Invoicify dashboard interface"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="py-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <Image src="/Logo.png" alt="Invoicify" width={35} height={35} />
                <span className="text-xl font-semibold">Invoicify</span>
              </div>

              <nav>
                <ul className="flex items-center gap-8 text-gray-600">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                <Link
                  href="#"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
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
                <Link
                  href="#"
                  className="hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}