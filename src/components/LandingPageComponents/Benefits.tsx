'use client';

const Benefits = () => {
    const benefits1 = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
            ),
            title: 'AI Site Builder',
            description: 'Instantly generate layouts, sections and content so you can launch in minutes not days.',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
            ),
            title: 'Founder-Ready Templates',
            description: 'Built for SaaS products, pricing pages, launches, and case studies everything a founder needs to go live.',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
            ),
            title: 'Portfolio Pages in Seconds',
            description: 'Highlight your apps, projects, or case studies fast with layouts designed to impress and convert.',
        }
    ];
    const benefits2 = [

        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            title: 'Flexible, Modular Layouts',
            description: 'Easily swap, duplicate, or re-style any section to match your evolving brand and product as your business scales.',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                    <polyline points="7.5 19.79 7.5 14.6 3 12" />
                    <polyline points="21 12 16.5 14.6 16.5 19.79" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
            ),
            title: 'Conversion-Optimized Design',
            description: 'Includes pre-optimized call-to-actions, hero messaging, testimonial layouts, and pricing sections tested and ready to launch.',
        },
    ];

    return (
        <section className="pb-16 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full border border-orange-100 shadow-sm mb-8">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-gray-700 font-medium text-[15px]">Benefits</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-[56px] font-bold text-gray-900 mb-6 leading-tight">
                        Build smarter sites, faster
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[19px] text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        Pre-optimized templates and AI tools that help founders launch bold, client winning sites without the usual grind.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                    {benefits1.map((benefit, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-8 border border-white shadow-sm hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors duration-300">
                                {benefit.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-[22px] font-semibold text-gray-900 mb-3 leading-tight">
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[16px] text-gray-500 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {benefits2.map((benefit, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm  hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors duration-300">
                                {benefit.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-[22px] font-semibold text-gray-900 mb-3 leading-tight">
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[16px] text-gray-500 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;