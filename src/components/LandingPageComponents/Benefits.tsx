'use client';

import { BadgeCheck } from "lucide-react";

const Benefits = () => {
    const benefits1 = [

        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            ),
            title: 'Lead Capture & Email Automation',
            description: 'Automatically capture leads and send follow-up emails without manual effort.',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12h-6" />
                    <path d="M3 12h6" />
                    <path d="M12 3v6" />
                    <path d="M12 15v6" />
                </svg>
            ),
            title: 'Handoff Mode',
            description: 'Disable AI anytime and chat directly with visitors for a personal touch.',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18v12H3z" />
                    <path d="M3 6l9 6 9-6" />
                </svg>
            ),
            title: 'Multi-Domain Support',
            description: 'Use XenorAi across multiple websites and domains with no extra setup required.',
        },

    ];
    const benefits2 = [

        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 12h16" />
                    <path d="M12 4v16" />
                </svg>
            ),
            title: 'Easy Script Integration',
            description: 'Simply copy and paste a small script snippet to enable the AI chatbot on your site.',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
            title: 'Product Promotion',
            description: 'Add your products so XenorAi can promote them to visitors automatically.',
        },
    ];

    return (
        <section id="benefits" className="py-10 md:py-20">
            < div className="max-w-7xl relative mx-auto px-6" >

                <div className="absolute inset-0 pointer-events-none z-0"></div>

                {/* Decorative Background Shape */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-300 via-orange-300 to-orange-500 rounded-full opacity-15 blur-3xl pointer-events-none z-0"></div>

                {/* Header */}
                < div className="text-center mb-20" >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-5 py-1.5 
    border border-gray-200 
    bg-white 
    rounded-full 
    shadow-sm 
    mb-2 
    group 
    hover:shadow-md 
    hover:border-orange-300 
    transition-all duration-300">

                        <BadgeCheck
                            className="w-5 h-5 text-orange-500 
        transition-all duration-300 
        group-hover:scale-110"
                        />

                        <span className="text-gray-700 font-medium text-[15px] 
        transition-colors duration-300 
        group-hover:text-black">
                            Benefits
                        </span>
                    </div>

                    {/* Title */}
                    < h2 className="text-[48px] font-[400] tracking-[-3.5] text-[#1e0d01] mb-4 leading-tight" >
                        Build smarter sites, faster
                    </h2 >

                    {/* Subtitle */}
                    < p className="mx-auto mt-4 max-w-md sm:max-w-lg lg:max-w-xl px-4 sm:px-0 text-[15px] sm:text-[16px] lg:text-[18px] font-[500] leading-relaxed text-[#1e0d0199] text-center " >

                        Pre - optimized templates and AI tools that help founders launch bold, client winning sites without the usual grind.
                    </p >
                </div >

                {/* Benefits Grid */}
                < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6" >
                    {
                        benefits1.map((benefit, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 border border-white cursor-pointer  shadow-sm hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors duration-300 border border-gray-300">
                                    {benefit.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-[22px] font-semibold text-[#1e0d01] mb-3 leading-tight">
                                    {benefit.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))
                    }
                </div >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {benefits2.map((benefit, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-8 border border-white cursor-pointer  shadow-sm hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors duration-300 border border-gray-300">
                                {benefit.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-[22px] font-semibold text-[#1e0d01] mb-3 leading-tight">
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div >
        </section >
    );
};

export default Benefits;