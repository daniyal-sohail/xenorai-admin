import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PricingCard() {
    const plans = [
        {
            name: 'Starter',
            price: '$29',
            period: '/ month',
            description: 'For solo makers & small teams',
            buttonText: 'Get Started Now',
            buttonStyle: 'bg-white text-[#F97518] hover:bg-orange-50',
            highlighted: false,
            badge: null,
            features: [
                '1 AI Agent (basic logic)',
                'Unlimited Layout Generator',
                'Embed widgets & internal tools',
                'Auto-optimized landing pages',
                '500 site visits/month',
                'Email support'
            ]
        },
        {
            name: 'Pro',
            price: '$299',
            period: '/ month',
            description: 'Launch with advanced workflows',
            buttonText: 'Get Started Now',
            buttonStyle: 'bg-[#F97518] text-white hover:bg-[#e86b13] shadow-[0_8px_16px_rgba(251,146,60,0.3)]',
            highlighted: true,
            badge: 'Save 20%',
            features: [
                'Everything in Starter',
                'Unlimited AI agents (advanced)',
                'Builder with smart templates',
                'Custom domain support',
                '10,000 site visits/month',
                'Priority support'
            ]
        },
        {
            name: 'Agency',
            price: '$899',
            period: '/ month',
            description: 'Full power for teams managing',
            buttonText: 'Get Started Now',
            buttonStyle: 'bg-white  text-[#F97518] hover:bg-orange-50',
            highlighted: false,
            badge: null,
            features: [
                'Everything in Pro',
                'Unlimited projects workspaces',
                'Team collaboration (10+ users)',
                'White-labeling options',
                'Analytics dashboard',
                'Dedicated support manager'
            ]
        }
    ];

    return (
        <section id="pricing" className="py-10 md:py-20">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-5 py-1.5 border border-gray-300 rounded-full  shadow-sm mb-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-gray-700 font-medium text-[15px]">How it Works</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-[48px] font-[400] tracking-[-3.5] text-[#1e0d01] mb-4 leading-tight">
                        How it Works
                    </h2>

                    {/* Subtitle */}
                    <p className="mx-auto mt-4 max-w-md sm:max-w-lg lg:max-w-xl px-4 sm:px-0 text-[15px] sm:text-[16px] lg:text-[18px] font-[500] leading-relaxed text-[#1e0d0199] text-center ">

                        Pre-optimized templates and AI tools that help founders launch bold, client winning sites without the usual grind.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl py-8 px-4 transition-all duration-300  ${plan.highlighted
                                ? 'border-1 border-orange-400 shadow-lg'
                                : 'bg-white border border-gray-200 hover:shadow-lg'
                                }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute -top-3 right-8">
                                    <div className="px-4 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-full border border-gray-200 shadow-sm">
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

                            <div className={`relative rounded-3xl p-4 transition-all duration-300  mb-8 ${plan.highlighted
                                ? 'bg-gradient-to-b from-orange-50 to-orange-50/80 '
                                : 'bg-gray-100 '
                                }`}>

                                {/* Plan Name */}
                                <div className="mb-3">
                                    <h3 className="text-[20px] font-semibold text-gray-900">
                                        {plan.name}
                                    </h3>
                                </div>

                                {/* Price */}
                                <div className="mb-3">
                                    <div className="flex items-baseline">
                                        <span className="text-[56px] font-bold text-gray-900 leading-none">
                                            {plan.price}
                                        </span>
                                        <span className="text-[18px] text-gray-500 ml-1">
                                            {plan.period}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[16px] text-gray-600 mb-8">
                                    {plan.description}
                                </p>

                                {/* CTA Button */}
                                <div className="flex w-full justify-center items-center">
                                    <Link
                                        href="mailto:skillhiveclub@ucp.edu.pk"
                                        className={`group  ${plan.buttonStyle}  h-10 rounded-full py-5 px-2 cursor-pointer shadow-lg flex justify-center items-center  hover:shadow-xl w-full transition-all duration-300 no-underline`}
                                    >
                                        <span className="mr-2">Let's Collab</span>
                                        <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                                    </Link>
                                </div>

                            </div>

                            {/* Features Header */}
                            <div className="mb-6">
                                <h4 className="text-[17px] font-semibold text-gray-900">
                                    What's Included:
                                </h4>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-3">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="flex items-start gap-3 text-[15px] text-gray-500 pb-3 border-gray-300 border-b"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}