'use client';

import Image from 'next/image';

const Features = () => {
    const mainFeatures = [
        {
            image: '/one.png', // Replace with your image
            title: 'AI-Powered Chatbot',
            description: 'Engage visitors instantly with an intelligent chatbot that answers questions, qualifies leads, and drives conversions.',
        },
        {
            image: '/one.png', // Replace with your image
            title: 'Multi-Domain Management',
            description: 'Manage chatbots across multiple websites from a single dashboard for seamless business operations.',
        },
    ];

    const bottomFeatures = [
        {
            image: '/one.png', // Replace with your image
            title: 'Live Analytics & Reports',
            description: 'Track all conversations, lead generation, and revenue metrics in real-time with intuitive dashboards.',
        },
        {
            image: '/one.png', // Replace with your image
            title: 'Voice & Multi-Language Support',
            description: 'Chat with customers in their preferred language or even through voice commands for a human-like experience.',
        },
        {
            image: '/one.png', // Replace with your image
            title: 'Automated Email Campaigns',
            description: 'Collect emails from chats and run automated campaigns to nurture leads and drive sales.',
        },
    ];

    return (
        <section id="features" className="py-10 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-5 py-1.5 border border-gray-300 rounded-full  shadow-sm mb-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-gray-700 font-medium text-[15px]">Key Features</span>
                    </div>


                    {/* Title */}
                    <h2 className="text-[48px] font-[400] tracking-[-3.5] text-[#1e0d01] mb-4 leading-tight">
                        Build smarter conversations, faster
                    </h2>

                    {/* Subtitle */}
                    <p className="mx-auto mt-4 max-w-md sm:max-w-lg lg:max-w-xl px-4 sm:px-0 text-[15px] sm:text-[16px] lg:text-[18px] font-[500] leading-relaxed text-[#1e0d0199] text-center ">

                        XenorAi provides ready to deploy AI chatbots that help businesses capture leads, automate sales, and delight customers  without complex setup or coding.
                    </p>
                </div>
                {/* Top Row - 2 Large Cards */}
                <div className="grid relative grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="absolute inset-0  pointer-events-none z-0"></div>

                    {/* Decorative Background Shape */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-pink-300 via-orange-300 to-orange-400 rounded-full opacity-10 blur-3xl pointer-events-none z-0"></div>

                    {mainFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-3xl p-4 px-6 hover:shadow-sm cursor-pointer transition-all duration-300"
                        >
                            {/* Image Preview */}
                            <div className="bg-white rounded-2xl mb-8 shadow-sm">
                                <div className="aspect-[4/2] relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Placeholder if no image */}

                                </div>
                            </div>



                            {/* Title */}
                            <h3 className="text-[22px] font-semibold text-[#1e0d01] mb-3 leading-tight">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom Row - 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bottomFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-3xl p-4 px-6 hover:shadow-sm cursor-pointer transition-all duration-300"
                        >
                            {/* Image Preview */}
                            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
                                <div className="aspect-[4/2] relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover"
                                    />


                                </div>
                            </div>

                            <h3 className="text-[22px] font-semibold text-[#1e0d01] mb-3 leading-tight">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;