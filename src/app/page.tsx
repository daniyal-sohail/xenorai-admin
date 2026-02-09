import About from '@/components/LandingPageComponents/About'
import Benefits from '@/components/LandingPageComponents/Benefits'
import FAQ from '@/components/LandingPageComponents/FAQ'
import Features from '@/components/LandingPageComponents/Features'
import Footer from '@/components/LandingPageComponents/Footer'
import Hero from '@/components/LandingPageComponents/Hero'
import HowWorks from '@/components/LandingPageComponents/HowWorks'
import Navbar from '@/components/LandingPageComponents/Navbar'
import Plans from '@/components/LandingPageComponents/Plans'
import React from 'react'

function page() {
  return (
    <main className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-br from-orange-50 via-pink-50 to-white">
      <div className="max-w-[1280px] mx-auto ">
        <Navbar />
        <Hero />
        <About />
        <Benefits />
        <HowWorks />
        <Features />
        <Plans />
        <FAQ />
        <Footer />
      </div>
    </main>

  )
}

export default page