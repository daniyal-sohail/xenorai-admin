'use client';

import { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: 'Do I need design or coding experience to use this?',
            answer: 'No design or coding experience required. Our AI-powered builder and pre-built templates make it easy for anyone to create professional websites. Just customize the content and launch.',
        },
        {
            question: 'Can I customize everything in the template?',
            answer: 'Yes, absolutely! Every component is fully customizable. You can modify colors, fonts, layouts, content, and add or remove sections to match your brand perfectly.',
        },
        {
            question: 'Is this template only for SaaS founders?',
            answer: 'While built specifically for SaaS founders, this template works great for any digital product, agency, or service-based business looking for a modern, conversion-optimized website.',
        },
        {
            question: 'How fast can I get my site live?',
            answer: 'With our AI-assisted builder, you can have a complete, polished site ready to launch in minutes, not days. Just pick a template, customize with AI, and publish.',
        },
        {
            question: 'Can I use this for client projects?',
            answer: 'Yes! Our Pro and Agency plans include commercial licenses, allowing you to use the templates for unlimited client projects and white-label solutions.',
        },
        {
            question: 'Is Framer free to use with this template?',
            answer: 'Framer offers a free plan to get started. For custom domains and advanced features, you\'ll need a Framer paid plan. Our templates work with all Framer plans.',
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-32 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column - Header */}
                    <div className="lg:sticky lg:top-32">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full border border-orange-100 shadow-sm mb-8">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                            </svg>
                            <span className="text-gray-700 font-medium text-[15px]">FAQs</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-[52px] font-bold text-gray-900 mb-6 leading-tight">
                            Frequently Asked Questions
                        </h2>

                        {/* Description */}
                        <p className="text-[18px] text-gray-500 mb-10 leading-relaxed">
                            From setup to support, here are the answers you need to launch faster with confidence.
                        </p>

                        {/* CTA Button */}
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white text-[17px] font-semibold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                            Get Started
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14m-7-7l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Column - Accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors duration-200"
                                >
                                    <span className="text-[18px] font-semibold text-gray-900 pr-8">
                                        {faq.question}
                                    </span>
                                    <svg
                                        className={`w-6 h-6 text-gray-900 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-8 pb-6">
                                        <p className="text-[16px] text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;