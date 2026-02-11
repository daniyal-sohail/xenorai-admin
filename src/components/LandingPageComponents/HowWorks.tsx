'use client';

const HowWorks = () => {
    const steps = [
        {
            icon: (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h18M3 6h18M3 18h18" /> {/* Simplified icon for entering domain */}
                </svg>
            ),
            title: 'Enter your domain',
            description: 'Simply provide the website URL where you want XenorAi to go live.',
        },
        {
            icon: (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2" /> {/* Script / code icon */}
                    <path d="M8 12h8" />
                </svg>
            ),
            title: 'Copy the script',
            description: 'Get the ready-to-use code snippet generated for your website.',
        },
        {
            icon: (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" /> {/* Checkmark / done icon */}
                </svg>
            ),
            title: 'Paste & go live',
            description: 'Add the script to your site and launch your AI chatbot in seconds.',
        },
    ];

    return (
        <section id="how-it-works" className="py-10 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
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
                        Get XenorAi on your site in 3 steps
                    </h2>

                    {/* Subtitle */}
                    <p className="mx-auto mt-4 max-w-md sm:max-w-lg lg:max-w-xl px-4 sm:px-0 text-[15px] sm:text-[16px] lg:text-[18px] font-[500] leading-relaxed text-[#1e0d0199] text-center ">

                        Add an AI powered chatbot to your website quickly, without coding. Just follow these simple steps.
                    </p>
                </div>

                {/* Steps with Curved Line */}
                <div className="relative max-w-6xl mx-auto">
                    {/* SVG Curved Connecting Line */}
                    <div className="absolute top-[-8] left-0 right-0 hidden lg:block pointer-events-none flex items-center justify-center">
                        <svg
                            className="w-full"
                            height="120"
                            viewBox="0 0 1200 120"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M 100,60 Q 350,20 600,60 T 1100,60"
                                stroke="#FED7AA"
                                strokeWidth="2"
                                strokeDasharray="6,6"
                                fill="none"
                            />
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center">
                                {/* Icon Circle with Dashed Border */}
                                <div className="relative inline-flex items-center justify-center mb-4">
                                    {/* Dashed Circle Border */}
                                    <div className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-orange-200/60">

                                        {/* Solid White Circle */}
                                        <div className="relative border-2  w-28 h-28 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-900">
                                            {step.icon}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-[22px] font-semibold text-[#1e0d01] mb-3 leading-tight">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowWorks;