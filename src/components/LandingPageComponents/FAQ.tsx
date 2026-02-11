'use client';

import { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: 'Do I need coding or design experience to use XenorAi?',
            answer: 'No coding or design experience is required. Just enter your website domain, copy the generated script, paste it into your site, and your AI chatbot goes live instantly.',
        },
        {
            question: 'How fast can I get the AI chatbot on my website?',
            answer: 'You can have XenorAi live on your site in seconds. Just follow the 3-step process: enter domain → copy script → paste and launch.',
        },
        {
            question: 'Can I customize the chatbot behavior?',
            answer: 'Yes! You can modify chatbot prompts, appearance, and integration settings to match your brand and user experience.',
        },
        {
            question: 'Is XenorAi suitable for any website?',
            answer: 'Absolutely! It works on SaaS sites, portfolios, e-commerce, blogs, and almost any website that allows custom script insertion.',
        },
        {
            question: 'Can I use it for multiple websites?',
            answer: 'Yes! Each subscription allows you to add XenorAi to multiple domains depending on your plan.',
        },
        {
            question: 'Do I need a paid plan to get started?',
            answer: 'No, you can start with a free plan to try XenorAi. Paid plans unlock advanced features, customization, and priority support.',
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-10 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid relative grid-cols-1 lg:grid-cols-[40%_55%] gap-16 items-start">
                    {/* Left Column - Header */}
                    <div>
                        {/* Badge */}
                        <div className=" mb-20">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2.5 px-5 py-1.5 border border-gray-300 rounded-full  shadow-sm mb-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="text-gray-700 font-medium text-[15px]">FAQ</span>
                            </div>


                            {/* Title */}
                            <h2 className="text-[48px] font-[400] tracking-[-3.5] text-[#1e0d01] mb-4 leading-tight">
                                Frequently Asked Questions

                            </h2>

                            {/* Subtitle */}
                            <p className="text-[18px] text-[#1e0d0199] font-[500] leading-relaxed">
                                Everything you need to know about adding XenorAi to your website quickly and easily.
                            </p>
                        </div>


                    </div>
                    <div className="absolute inset-0 pointer-events-none z-0"></div>

                    {/* Decorative Background Shape */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-300 via-orange-300 to-orange-500 rounded-full opacity-15 blur-3xl pointer-events-none z-0"></div>

                    {/* Right Column - Accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 rounded-xl border border-gray-300 overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-8 py-5 flex items-center justify-between text-left transition-colors duration-200"
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
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'opacity-100' : 'max-h-0 opacity-0'
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