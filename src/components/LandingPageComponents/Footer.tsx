import React from "react";
import {
    Facebook,
    Linkedin,
    Instagram,
    Send,
    ChevronRight,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="w-full">

            <div className="max-w-7xl mx-auto px-6 py-6 md:py-10 ">

                {/* Main Footer Content */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-2 max-w-full">

                    {/* Brand Section */}
                    {/* Brand Section */}
                    <div className="lg:w-[30%]">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-2.5">
                                <Image
                                    src="/logo.png"   // put your icon here
                                    alt="Logo"
                                    width={50}
                                    height={50}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-xl font-semibold text-gray-900">
                                Xenor<span className="text-[#F97518]">Ai</span>
                            </span>
                        </div>

                        <p className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed mb-8">
                            XenorAi is your AI-powered chatbot solution — deploy a smart, interactive chatbot on your website in seconds. Copy, paste, and let AI handle the conversations seamlessly.
                        </p>

                        <div className="flex items-center gap-4">
                            {[Facebook, Linkedin, Instagram, Send].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>


                    {/* Company */}
                    <div className="lg:w-[15%]">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Home",
                                "About us",
                                "Pricing",
                                "Blog",
                                "Blog Details",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed hover:text-orange-500 transition-colors duration-300"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Features (formerly Product) */}
                    <div className="lg:w-[15%]">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Features
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "AI Chatbot for Websites",
                                "Lead Capture & Email Automation",
                                "Multi-Domain Support",

                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed hover:text-orange-500 transition-colors duration-300"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / About DevXcript */}
                    <div className="lg:w-[30%]">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            About DevXcript
                        </h3>
                        <p className="text-[16px] font-[500] text-[#1e0d0199] leading-relaxed  mb-6">
                            Empowering businesses with NextGen AI & SaaS solutions.
                            Explore DevXcript to discover AI-powered solutions and SaaS-based products that transform ideas into impact and help businesses grow faster.
                        </p>
                    </div>
                </div>


                {/* Footer Bottom */}
                <div className="pt-8 border-t relative border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 overflow-hidden">

                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © 2025 Alwork. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Powered by{" "}
                        <span className="text-gray-900 font-medium">
                            DevXcript
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
