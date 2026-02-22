import About from '@/components/LandingPageComponents/About'
import Benefits from '@/components/LandingPageComponents/Benefits'
import FAQ from '@/components/LandingPageComponents/FAQ'
import Features from '@/components/LandingPageComponents/Features'
import Footer from '@/components/LandingPageComponents/Footer'
import Hero from '@/components/LandingPageComponents/Hero'
import HowWorks from '@/components/LandingPageComponents/HowWorks'
import Navbar from '@/components/LandingPageComponents/Navbar'
import Newsletter from '@/components/LandingPageComponents/NewsLetter'
import Plans from '@/components/LandingPageComponents/Plans'
import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

function page() {
  return (
    <>
      <main className="min-h-screen px-0 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-[1280px] mx-auto">
          <Navbar />
          <Hero />
          <About />
          <Features />
          <HowWorks />
          <Benefits />
          <Plans />
          <FAQ />
          <Newsletter />
          <Footer />
        </div>
      </main>
    </>
  )
}

export default page