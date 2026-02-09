'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0  pointer-events-none z-0"></div>

            <div className="max-w-6xl mx-auto px-6 pt-40 relative z-10">
                {/* Badge */}
                <div
                    className={`flex cursor-pointer justify-center mb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <div className="inline-flex items-center justify-between gap-3 px-5 py-1.5  rounded-full border border-gray-300">

                        <div className="w-2 h-2 bg-[#F97518] rounded-full animate-pulse"></div>
                        <span className="text-gray-500 text-sm font-medium">Upcoming version 2.0</span>
                    </div>
                </div>

                {/* Main Heading */}
                <div
                    className={`text-center mb-7 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <h1 className="text-[60px] font-[500] text-[#1e0d01] leading-[52.5px]">
                        Launch your AI or SaaS<br />startup in days
                    </h1>


                </div>

                {/* Subheading */}
                <div
                    className={`text-center mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <p className="text-[19px] text-gray-500 leading-relaxed max-w-3xl mx-auto font-normal">
                        Built for SaaS founders, solo creators, and lean agencies who need to launch fast,<br />
                        look polished, and make a bold impression from day one.
                    </p>
                </div>

                {/* CTA Button */}
                <div
                    className={`flex justify-center mb-20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <Link
                        href="mailto:skillhiveclub@ucp.edu.pk"
                        className="group bg-[#F97518] text-white h-13 w-42 rounded-full py-2 px-2 cursor-pointer shadow-lg flex justify-center items-center hover:bg-[#e86b13] hover:shadow-xl transition-all duration-300 no-underline"
                    >
                        <span className="mr-2 text-[18px]">Let's Collab</span>
                        <ArrowRight className="w-6 h-6 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                    </Link>
                </div>

                {/* Social Proof */}
                <div
                    className={`flex justify-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <div className="inline-flex items-center gap-4 px-8 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                        {/* Avatars */}

                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium text-[15px]">Powered By DevXcript</span>
                        </div>
                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200"></div>

                        {/* Reviews */}
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium text-[15px]">2.4k+ Reviews</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200"></div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-semibold text-[15px]">5.0</span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                            fill="#FDB022"
                                        />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image - Zooming Effect */}
                <div

                    className='relative w-full '
                >
                    {/* Image */}
                    <div
                        className='relative z-10 rounded-lg overflow-hidden   transition-all duration-300 mt-18'
                    >
                        <img src="/one.png" alt="hero" className='w-full h-full object-cover' />
                        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10'></div>
                    </div>
                </div>
            </div>

            {/* Background Gradient Orbs */}

        </section>
    );
};

export default HeroSection;
