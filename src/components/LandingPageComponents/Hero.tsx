'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react';
import { useForm } from '@formspree/react';
import { Popup } from '@/components/common/PopUp';

const HeroSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [state, handleSubmit] = useForm("mreakbkq");
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (state.succeeded) {
            setPopupType('success');
            setPopupOpen(true);
        } else if (state.errors && Object.keys(state.errors).length > 0) {
            setPopupType('error');
            setPopupOpen(true);
        }
    }, [state.succeeded, state.errors]);

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0  pointer-events-none z-0"></div>

            {/* Decorative Background Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-pink-300 via-orange-300 to-orange-400 rounded-full opacity-30 blur-3xl pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-6 pt-40 relat
            ive z-10">
                {/* Badge */}
                <div
                    className={`flex cursor-pointer justify-center mb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <div className="inline-flex items-center justify-between gap-3 px-5 py-1.5  rounded-full border border-gray-300">

                        <div className="w-2 h-2 bg-[#F97518] rounded-full animate-pulse"></div>
                        <span className="text-gray-500 text-sm font-medium">Now in Early Access</span>
                    </div>
                </div>

                {/* Main Heading */}
                <div
                    className={`text-center mb-7 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <h1 className="text-[60px] font-[500] text-[#1e0d01] leading-[54.5px]">
                        AI sales chatbot built to<br />convert visitors into revenue
                    </h1>


                </div>

                {/* Subheading */}
                <div
                    className={`text-center mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <p className="text-[19px] text-gray-500 leading-relaxed max-w-3xl mx-auto font-normal">
                        XenorAi is an AI-powered website chatbot that answers instantly,<br />
                        qualifies leads, and supports your customers  24/7, without human effort.
                    </p>
                </div>

                {/* CTA Button */}
                <form onSubmit={handleSubmit} className="mx-auto mt-10 mb-20 max-w-xl relative">
                    <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="Enter your email"
                        disabled={state.submitting}
                        className="w-full rounded-full border border-gray-200 bg-white px-6 py-4 sm:pr-48 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/60 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={state.submitting}
                        className="group mt-3 w-full bg-[#F97518] text-white rounded-full py-2 px-4 cursor-pointer shadow-lg flex justify-center items-center hover:bg-[#e86b13] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2"
                    >
                        <span className="mr-2 text-[16px] whitespace-nowrap">
                            {state.submitting ? 'Submitting...' : 'Get Early Access'}
                        </span>
                        <ArrowRight className="w-5 h-5 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                    </button>
                </form>

                <Popup
                    open={popupOpen}
                    type={popupType}
                    title={popupType === 'success' ? 'Success!' : 'Error'}
                    message={
                        popupType === 'success'
                            ? "Awesome! 🎉 You're on the list for XenorAi early access. We'll notify you as soon as it's ready!"
                            : "Oops! Something went wrong. Please double-check your email and try again."

                    }
                    onClose={() => setPopupOpen(false)}
                />

                {/* Social Proof */}
                <div
                    className={`flex justify-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <div className="inline-flex items-center gap-4 px-8 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                        {/* Avatars */}

                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium text-[15px]">Built by DevXcript
                            </span>
                        </div>
                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200"></div>

                        {/* Reviews */}
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium text-[15px]"> AI-Powered </span>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium text-[15px]">  Designed for Real Sales</span>
                        </div>


                    </div>
                </div>

                {/* Hero Image - Zooming Effect */}
                <div

                    className='relative w-full '
                >
                    {/* Image */}
                    <div

                        className='relative w-full '
                    >
                        {/* Image */}
                        <div
                            className='relative z-10 rounded-lg overflow-hidden   transition-all duration-300 mt-18'
                        >
                            <img src="/main2.png" alt="hero" className='w-full h-full object-cover' />
                            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10'></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Gradient Orbs */}

        </section>
    );
};

export default HeroSection;
