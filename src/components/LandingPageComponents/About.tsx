'use client';

import { Brain, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const About = () => {
    const [visibleWords, setVisibleWords] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    const text =
        "XenorAi is built to help businesses turn their websites into intelligent conversations. We create AI-powered chatbots that instantly answer visitor questions, qualify leads, and support customers using your own business data. Our focus is simple  make websites smarter, faster, and more conversion-driven without adding operational complexity.";


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
        { number: '24/7', label: 'Instant AI responses' },
        { number: '100%', label: 'Website trained AI' },
        { number: '3x', label: 'Faster response time' },
    ];

    return (
        <section id="about" ref={sectionRef} className="relative py-10 md:py-20 overflow-hidden mt-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-1.5 
    border border-gray-200 
    bg-white 
    rounded-full 
    shadow-sm 
    mb-2 
    group 
    hover:shadow-md 
    hover:border-orange-300 
    transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-offset="50">

                    <Brain
                        className="w-5 h-5 text-orange-500 
        transition-all duration-300 
        group-hover:scale-110"
                    />

                    <span className="text-gray-700 font-medium text-[15px] 
        transition-colors duration-300 
        group-hover:text-black">
                        About XenorAi
                    </span>
                </div>

                {/* Text + First Row Pills */}
                <div className="relative mb-8">
                    <div className="max-w-4xl" data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.3] font-normal">
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
                    <div className="hidden lg:flex absolute top-0 right-0 flex-col gap-8">
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
                                AI Automation
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats + Second Row Pills */}
                <div className="relative">
                    <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 max-w-3xl">
                        {stats.map((stat, index) => (
                            <div key={index} data-aos="fade-up" data-aos-delay={`${200 + index * 100}`}>
                                <div className="text-[32px] sm:text-[48px] md:text-[56px] font-bold text-gray-900 leading-none mb-2 sm:mb-3">
                                    {stat.number}
                                </div>
                                <div className="text-gray-500 text-[14px] sm:text-[15px] leading-snug">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second Row Pills - Right Side */}
                    <div className="hidden lg:flex absolute bottom-0 right-0 items-end gap-6">


                        {/* Lead Gen Tools - Orange */}
                        <div style={{ transform: 'rotate(12deg) translateY(-10px)' }}>
                            <div className="px-6 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white font-semibold text-[17px] rounded-full shadow-lg whitespace-nowrap opacity-70">
                                Lead Capture Tools
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