import React from 'react';
import {
    Facebook,
    Linkedin,
    Instagram,
    Send,
    ChevronRight
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">
                    {/* Brand Section */}
                    <div className="lg:pr-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-400 transform -skew-x-12"></div>
                            <span className="text-xl font-semibold text-gray-900">Flexfolio</span>
                        </div>
                        <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
                            AI-powered portfolio template designed to help SaaS founders, creators launch stunning sites effortlessly and fast.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                                aria-label="Telegram"
                            >
                                <Send size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company</h3>
                        <ul className="space-y-3.5">
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    About us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Blog Details
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Product</h3>
                        <ul className="space-y-3.5">
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    404
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors duration-300">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Newsletter</h3>
                        <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
                            Get tips, product updates, and insights on working smarter with AI.
                        </p>
                        <form className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 px-5 py-3.5 border border-gray-200 rounded-lg text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
                            />
                            <button
                                type="submit"
                                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-medium text-[15px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                            >
                                Subscribe
                                <ChevronRight size={12} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2025 Alwork. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Powered by <span className="text-gray-900 font-medium">Framer</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;