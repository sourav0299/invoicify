import { Checkout } from "@polar-sh/nextjs"

export const GET = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    successUrl: "https://localhost:3000/dashboard",
    server: "sandbox",
})