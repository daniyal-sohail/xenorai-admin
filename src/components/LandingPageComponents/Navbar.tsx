"use client";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "#about" },
        { name: "Events", href: "#events" },
        { name: "Hierarchy", href: "#why-join" },
    ];

    const navLinkClasses =
        "flex items-center h-4 font-medium text-[17px] text-gray-700 hover:text-[#F97518] no-underline";

    const mobileButtonClasses =
        "text-left px-4 py-3 font-medium text-[17px] text-gray-700 rounded-xl hover:text-[#F97518] transition-colors duration-200";

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        e.stopPropagation();
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);

        if (element) {
            const navbarHeight = 128; // Height of navbar (h-32 = 128px)
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }

        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="w-full absolute top-0 left-0 z-50 h-32 flex justify-center">
            {/* Desktop Navbar */}
            <div className="hidden md:flex justify-center items-center relative z-10 h-full px-4 xl:px-12 w-full">
                <div className="flex-1 max-w-[865px] h-16 rounded-[100px] flex items-center shadow-lg">
                    <div className="w-full h-4 flex items-center px-5">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                                        fill="white"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center justify-center gap-8 ml-8 w-full h-4">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className={navLinkClasses}
                                    onClick={(e) => {
                                        if (link.href.startsWith("#")) handleSmoothScroll(e, link.href);
                                        if (link.href === "/") {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-center items-center">
                            <Link
                                href="mailto:skillhiveclub@ucp.edu.pk"
                                className="group bg-[#F97518] text-white h-10 w-36 rounded-full py-2 px-2 cursor-pointer shadow-lg flex justify-center items-center hover:bg-[#e86b13] hover:shadow-xl transition-all duration-300 no-underline"
                            >
                                <span className="mr-2">Let's Collab</span>
                                <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="md:hidden relative z-10 flex justify-center items-center h-32 px-4 w-full">
                <div className="relative w-full max-w-[376px] h-14">
                    {/* Background */}
                    <div className="absolute inset-0 bg-white rounded-[100px] shadow-[0px_4px_21px_3px_rgba(0,0,0,0.08)]" />

                    {/* Logo */}
                    <div className="absolute left-4 top-2 flex items-center h-10">
                        <div className="relative w-12 h-12 mr-2">
                            <Image src="/images/logos/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                    </div>

                    {/* Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        className="absolute top-2 right-2 w-9 h-9 rounded-full bg-[#3d6b1f] shadow flex items-center justify-center z-10"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                    </button>
                </div>

                {/* Mobile Slide-down Menu */}
                <div
                    className={`absolute top-[100px] left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 z-50 ${isMobileMenuOpen
                        ? "max-h-[400px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95 pointer-events-none"
                        }`}
                >
                    <div className="flex flex-col p-2">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className={mobileButtonClasses}
                                onClick={(e) => {
                                    if (link.href.startsWith("#")) handleSmoothScroll(e, link.href);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile CTA */}
                        <div className="p-4 border-t border-gray-100 mt-2">
                            <Link
                                href="mailto:skillhiveclub@ucp.edu.pk"
                                className="group w-full bg-[#3d6b1f] text-white py-3 px-4 rounded-full font-medium hover:bg-[#2d5016] transition-all duration-300 flex justify-center items-center shadow-lg no-underline"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="mr-2">Let's Collab</span>
                                <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
