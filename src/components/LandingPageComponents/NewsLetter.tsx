// components/Newsletter.tsx
"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Newsletter() {
    return (
        <section className="w-full py-10 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-orange-500 via-red-500 to-yellow-400 px-6 py-12 text-center sm:px-10">

                    {/* Soft gradient blobs */}
                    <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-orange-400 opacity-40 blur-3xl" />
                    <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-yellow-300 opacity-40 blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 mx-auto max-w-3xl">
                        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                            Add XenorAi to your site
                            <br className="hidden sm:block" />
                            in seconds
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl text-[16px] font-[400] leading-relaxed text-white/90 sm:text-lg">
                            Just enter your website domain, copy the script, and paste it — your AI chatbot is live instantly. Automate support, engage users, and boost conversions without any coding.
                        </p>

                        {/* Email form */}
                        <form className="mx-auto mt-10 max-w-xl relative mb-2">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email for early access"
                                className="w-full rounded-full bg-white px-6 py-4 pr-48 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/60"
                            />
                            <Link
                                href="mailto:hello@xenorai.com"
                                className="group absolute right-2 top-1/2 -translate-y-1/2 bg-[#F97518] text-white rounded-full py-2 px-4 cursor-pointer shadow-lg flex justify-center items-center hover:bg-[#e86b13] hover:shadow-xl transition-all duration-300 no-underline"
                            >
                                <span className="mr-2 text-[16px] whitespace-nowrap">Get Early Access</span>
                                <ArrowRight className="w-5 h-5 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
