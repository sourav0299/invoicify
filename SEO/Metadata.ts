import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invoicify - Smart Billing & Business Management Solution',
  description: 'All-in-one billing software for small and medium businesses. Generate invoices, manage expenses, track inventory, and create detailed reports with GST compliance.',
  keywords: 'billing software, invoice generator, business management, GST billing, expense tracking, inventory management',
  openGraph: {
    title: 'Invoicify - Smart Billing & Business Management Solution',
    description: 'Streamline your business operations with Invoicify. Create invoices, manage expenses, and track business growth all in one place.',
    type: 'website',
    url: 'https://invoicify.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Invoicify Dashboard'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invoicify - Smart Billing Software',
    description: 'Generate professional invoices and manage your business efficiently',
    images: ['/twitter-image.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}