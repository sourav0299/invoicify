export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Invoicify",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web browser",
    "offers": {
      "@type": "Offer",
      "price": "149.00",
      "priceCurrency": "INR"
    },
    "description": "Professional billing and business management software for SMEs",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1500"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}