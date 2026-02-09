'use client';

const HowWorks = () => {
    const steps = [
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: 'Pick a template',
            description: 'Clean, confident. Sets the foundation with minimal words.',
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6" />
                    <path d="m4.22 4.22 4.24 4.24m5.08 5.08 4.24 4.24" />
                    <path d="M1 12h6m6 0h6" />
                    <path d="m4.22 19.78 4.24-4.24m5.08-5.08 4.24-4.24" />
                </svg>
            ),
            title: 'Customize with AI',
            description: 'Direct and modern clearly shows value and tech power.',
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                </svg>
            ),
            title: 'Launch your site',
            description: 'Clear and motivating focused on action and result.',
        },
    ];

    return (
        <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-28">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full border border-orange-100 shadow-sm mb-8">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
                        </svg>
                        <span className="text-gray-700 font-medium text-[15px]">How it works</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-[56px] font-bold text-gray-900 mb-6 leading-tight">
                        How it works
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[19px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        A smooth 3-step process to get your SaaS or client site live
                    </p>
                </div>

                {/* Steps with Curved Line */}
                <div className="relative max-w-6xl mx-auto">
                    {/* SVG Curved Connecting Line */}
                    <div className="absolute top-16 left-0 right-0 hidden lg:block pointer-events-none">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center">
                                {/* Icon Circle with Dashed Border */}
                                <div className="relative inline-flex items-center justify-center mb-10">
                                    {/* Dashed Circle Border */}
                                    <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-dashed border-orange-200/60"></div>

                                    {/* Solid White Circle */}
                                    <div className="relative w-28 h-28 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-900">
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-[26px] font-semibold text-gray-900 mb-4">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[17px] text-gray-500 leading-relaxed max-w-sm mx-auto">
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