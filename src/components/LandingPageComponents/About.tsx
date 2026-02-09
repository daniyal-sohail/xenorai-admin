'use client';

import { useEffect, useRef, useState } from 'react';

const About = () => {
    const [visibleWords, setVisibleWords] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    const text = "We're a digital design team focused on empowering SaaS startups and solo founders with bold, high-converting templates powered by AI. We believe in design that moves — fast, flexible, and beautiful. Our goal is to give lean teams the tools to launch standout brands without wasting time or budget.";

    const words = text.split(' ');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Reset and start animation
                        setVisibleWords(0);
                        words.forEach((_, index) => {
                            setTimeout(() => {
                                setVisibleWords(index + 1);
                            }, index * 50);
                        });
                    } else {
                        // Reset when out of view
                        setVisibleWords(0);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const stats = [
        { number: '25+', label: 'SaaS brands launched' },
        { number: '100+', label: 'Startup Projects' },
        { number: '4+', label: 'AI - tools integrated' },
    ];

    return (
        <section ref={sectionRef} className="relative py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Badge */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-gray-700 font-medium text-[15px]">About Company</span>
                    </div>
                </div>

                {/* Text + First Row Pills */}
                <div className="relative mb-8">
                    <div className="max-w-4xl">
                        <h2 className="text-[32px] leading-[1.3] font-normal">
                            {words.map((word, index) => (
                                <span
                                    key={index}
                                    className={`transition-colors duration-500 ${index < visibleWords ? 'text-gray-900' : 'text-gray-400'
                                        }`}
                                >
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>
                    </div>

                    {/* First Row Pills - Right Side */}
                    <div className="absolute top-0 right-0 flex flex-col gap-8">
                        {/* Faster Workflow - Purple */}
                        <div style={{ transform: 'rotate(5deg)' }}>
                            <div className="px-6 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-semibold text-[17px] rounded-full shadow-lg whitespace-nowrap opacity-70">
                                Faster Workflow
                            </div>
                        </div>

                        {/* B2B Platforms - Orange */}
                        <div className="ml-8" style={{ transform: 'rotate(-8deg)' }}>
                            <div className="px-6 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white font-semibold text-[17px] rounded-full shadow-lg whitespace-nowrap opacity-70">
                                B2B Platforms
                            </div>
                        </div>

                        {/* No-Code Tools - Cyan */}
                        <div className="ml-4" style={{ transform: 'rotate(6deg)' }}>
                            <div className="px-6 py-2 bg-gradient-to-r from-cyan-300 to-cyan-400 text-white font-semibold text-[17px] rounded-full shadow-lg whitespace-nowrap opacity-70">
                                No-Code Tools
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats + Second Row Pills */}
                <div className="relative">
                    <div className="grid grid-cols-3 gap-12 max-w-3xl">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <div className="text-[56px] font-bold text-gray-900 leading-none mb-3">
                                    {stat.number}
                                </div>
                                <div className="text-gray-500 text-[15px] leading-snug">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second Row Pills - Right Side */}
                    <div className="absolute bottom-0 right-0 flex items-end gap-6">


                        {/* Lead Gen Tools - Orange */}
                        <div style={{ transform: 'rotate(12deg) translateY(-10px)' }}>
                            <div className="px-6 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white font-semibold text-[17px] rounded-full shadow-lg whitespace-nowrap opacity-70">
                                Lead Gen Tools
                            </div>
                        </div>

                        {/* AI Startups - Emerald */}
                        <div style={{ transform: 'rotate(-3deg)' }}>
                            <div className="px-6 py-2 bg-gradient-to-r from-emerald-300 to-emerald-400 text-white font-semibold text-[17px] rounded-full shadow-lg whitespace-nowrap opacity-70">
                                AI Startups
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;