'use client';

const Plans = () => {
    const plans = [
        {
            name: 'Starter',
            price: '$29',
            period: '/ month',
            description: 'For solo makers & small teams',
            buttonText: 'Get Started Now',
            buttonStyle: 'border-2 border-orange-500 text-orange-500 bg-white hover:bg-orange-50',
            highlighted: false,
            features: [
                '1 AI Agent (basic logic)',
                'Unlimited Layout Generator',
                'Embed widgets & internal tools',
                'Auto-optimized landing pages',
                '500 site visits/month',
                'Email support',
            ],
        },
        {
            name: 'Pro',
            price: '$299',
            period: '/ month',
            description: 'Launch with advanced workflows',
            buttonText: 'Get Started Now',
            buttonStyle: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg',
            highlighted: true,
            badge: 'Save 20%',
            features: [
                'Everything in Starter',
                'Unlimited AI agents (advanced)',
                'Builder with smart templates',
                'Custom domain support',
                '10,000 site visits/month',
                'Priority support',
            ],
        },
        {
            name: 'Agency',
            price: '$899',
            period: '/ month',
            description: 'Full power for teams managing',
            buttonText: 'Get Started Now',
            buttonStyle: 'border-2 border-orange-500 text-orange-500 bg-white hover:bg-orange-50',
            highlighted: false,
            features: [
                'Everything in Pro',
                'Unlimited projects workspaces',
                'Team collaboration (10+ users)',
                'White-labeling options',
                'Analytics dashboard',
                'Dedicated support manager',
            ],
        },
    ];

    return (
        <section className="py-32 bg-[#faf8f5]">
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
                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl p-8 transition-all duration-300 ${plan.highlighted
                                ? 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-300 shadow-xl scale-105'
                                : 'bg-white border border-gray-200 hover:shadow-lg'
                                }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute -top-3 right-8">
                                    <div className="px-4 py-1.5 bg-gray-900 text-white text-sm font-semibold rounded-full">
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

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
                            <button
                                className={`w-full px-6 py-4 rounded-full text-[16px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 mb-10 ${plan.buttonStyle}`}
                            >
                                {plan.buttonText}
                                <svg
                                    width="16"
                                    height="16"
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

                            {/* Features Header */}
                            <div className="mb-6">
                                <h4 className="text-[17px] font-semibold text-gray-900">
                                    What's Included:
                                </h4>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-4">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="flex items-start gap-3 text-[15px] text-gray-600"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5"
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
};

export default Plans;