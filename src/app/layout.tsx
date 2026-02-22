import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/LandingPageComponents/SmoothScroll";
import LoadingScreen from "@/components/LandingPageComponents/LoadingScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "XenorAi - AI Sales Chatbot That Converts Visitors Into Revenue",
  description: "AI-powered website chatbot that answers questions instantly, captures leads, automates sales and supports customers 24/7. Turn your website into a revenue machine.",
  keywords: [
    "AI chatbot",
    "AI sales chatbot",
    "website chatbot",
    "lead capture software",
    "sales automation",
    "email automation",
    "AI customer support",
    "multi-language chatbot",
    "chatbot for websites",
    "automated lead generation",
    "AI sales agent",
    "website automation",
    "conversational AI",
    "live chat software",
    "AI assistant for business"
  ],
  authors: [{ name: "DevXcript" }],
  creator: "DevXcript",
  publisher: "XenorAi",
  metadataBase: new URL("https://xenorai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xenorai.com",
    title: "XenorAi - AI Sales Chatbot That Converts Visitors Into Revenue",
    description: "Deploy an AI-powered chatbot on your website in seconds. Capture leads, automate sales, and provide 24/7 customer support without any coding.",
    siteName: "XenorAi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "XenorAi - AI Sales Chatbot Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XenorAi - AI Sales Chatbot That Converts Visitors Into Revenue",
    description: "Deploy an AI-powered chatbot on your website in seconds. Capture leads, automate sales, and provide 24/7 customer support.",
    images: ["/twitter-image.png"],
    creator: "@xenorai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F97518" />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <SmoothScroll />
        <LoadingScreen />
        {children}

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "XenorAi",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description": "AI-powered website chatbot that answers questions instantly, captures leads, automates sales and supports customers 24/7.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "priceValidUntil": "2027-12-31"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              },
              "creator": {
                "@type": "Organization",
                "name": "DevXcript",
                "url": "https://xenorai.com"
              },
              "featureList": [
                "AI-Powered Chatbot",
                "Lead Capture & Email Automation",
                "Multi-Domain Support",
                "Voice & Multi-Language Support",
                "Live Analytics & Reports",
                "24/7 Customer Support"
              ]
            })
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "XenorAi",
              "url": "https://xenorai.com",
              "logo": "https://xenorai.com/logo.png",
              "description": "AI sales chatbot platform that helps businesses convert website visitors into revenue through intelligent conversations.",
              "foundingDate": "2024",
              "founder": {
                "@type": "Organization",
                "name": "DevXcript"
              },
              "sameAs": [
                "https://twitter.com/xenorai",
                "https://linkedin.com/company/xenorai",
                "https://facebook.com/xenorai"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "email": "support@xenorai.com",
                "availableLanguage": ["English", "Spanish", "French", "German"]
              }
            })
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Do I need coding or design experience to use XenorAi?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No coding or design experience is required. Just enter your website domain, copy the generated script, paste it into your site, and your AI chatbot goes live instantly."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How fast can I get the AI chatbot on my website?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can have XenorAi live on your site in seconds. Just follow the 3-step process: enter domain → copy script → paste and launch."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I use it for multiple websites?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Each subscription allows you to add XenorAi to multiple domains depending on your plan."
                  }
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
