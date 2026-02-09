'use client';

import Image from 'next/image';

const Features = () => {
    const mainFeatures = [
        {
            image: '/ai-page-builder.png', // Replace with your image
            tags: ['AI Components', 'AI-Driven Layouts', 'No-Code', 'Visual Builder'],
            title: 'AI-Assisted Page Builder',
            description: 'Create complete, conversion-focused pages in seconds with our AI layout and copy suggestions no coding or Figma skills required.',
        },
        {
            image: '/portfolio-layouts.png', // Replace with your image
            tags: [],
            title: 'Pre-Built Portfolio Layouts',
            description: 'Choose from expertly designed study and project templates to showcase.',
        },
    ];

    const bottomFeatures = [
        {
            image: '/modular-design.png', // Replace with your image
            title: 'Clean, Modular Design System',
            description: 'Every component is reusable, scalable and easy to customize startups.',
        },
        {
            image: '/conversion-sections.png', // Replace with your image
            title: 'Conversion Driven Sections',
            description: 'From bold hero headlines to persuasive testimonials and convert visitors.',
        },
        {
            image: '/fast-launch.png', // Replace with your image
            title: 'Fast Launch site',
            description: "Forget dev handoffs. Everything's ready to go live, getting results immediately.",
        },
    ];

    return (
        <section className="py-32 bg-white">
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
                {/* Top Row - 2 Large Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {mainFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Image Preview */}
                            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
                                <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Placeholder if no image */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-gray-300 mb-2">
                                                {feature.title}
                                            </div>
                                            <div className="text-sm text-gray-400">Preview Image</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags (if any) */}
                            {feature.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {feature.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="px-4 py-1.5 bg-white text-gray-600 text-sm font-medium rounded-full border border-gray-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h3 className="text-[28px] font-semibold text-gray-900 mb-4">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[17px] text-gray-500 leading-relaxed">
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
                            className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Image Preview */}
                            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
                                <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Placeholder if no image */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <div className="text-xl font-bold text-gray-300 mb-1">
                                                {feature.title}
                                            </div>
                                            <div className="text-xs text-gray-400">Preview</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-[24px] font-semibold text-gray-900 mb-4">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[16px] text-gray-500 leading-relaxed">
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