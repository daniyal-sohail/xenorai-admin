import React from "react";
import {
    Facebook,
    Linkedin,
    Instagram,
    Send,
    ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="w-full">

            <div className="max-w-7xl mx-auto px-6 py-6 md:py-10 ">

                {/* Main Footer Content */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-2 max-w-full"
                    data-aos="fade-up">

                    {/* Brand Section */}
                    {/* Brand Section */}
                    <div className="lg:w-[30%]"
                        data-aos="fade-up"
                        data-aos-delay="100">
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
                            <a
                                href="https://www.facebook.com/profile.php?id=61579221862576"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/devxcript/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="https://www.instagram.com/devxcript"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>


                    {/* Company */}
                    <div className="lg:w-[15%]"
                        data-aos="fade-up"
                        data-aos-delay="150">
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
                    <div className="lg:w-[15%]"
                        data-aos="fade-up"
                        data-aos-delay="200">
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
                    <div className="lg:w-[30%]"
                        data-aos="fade-up"
                        data-aos-delay="250">
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
                <div className="pt-8 border-t relative border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay="300">

                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © 2026 All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Powered by{" "}
                        <Link
                            href="https://www.devxcript.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-900 font-medium"
                        >
                            DevXcript
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
