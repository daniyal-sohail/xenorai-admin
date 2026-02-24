// components/Newsletter.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from '@formspree/react';
import { Popup } from '@/components/common/PopUp';
import { analytics } from '@/lib/analytics';

export default function Newsletter() {
    const [state, handleSubmit] = useForm("mreakbkq");
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (state.succeeded) {
            setPopupType('success');
            setPopupOpen(true);
            // Track newsletter subscription
            analytics.trackNewsletterSignup('newsletter_section');
            analytics.trackConversion('newsletter_signup');
        } else if (state.errors && Object.keys(state.errors).length > 0) {
            setPopupType('error');
            setPopupOpen(true);
        }
    }, [state.succeeded, state.errors]);

    return (
        <section className="w-full py-10 md:py-20"
            data-aos="fade-up">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-orange-500 via-red-500 to-yellow-400 px-6 py-12 text-center sm:px-10"
                    data-aos="fade-up"
                    data-aos-delay="100">

                    {/* Soft gradient blobs */}
                    <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-orange-400 opacity-40 blur-3xl" />
                    <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-yellow-300 opacity-40 blur-3xl" />

                    {/* Content */}
                    {/* Content */}
                    <div className="relative z-10 mx-auto max-w-3xl"
                        data-aos="fade-up"
                        data-aos-delay="150">
                        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                            Stay Updated with XenorAi
                            <br className="hidden sm:block" />
                            Subscribe to Our Newsletter
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl text-[16px] font-[400] leading-relaxed text-white/90 sm:text-lg">
                            Be the first to know about new features, product updates, and exclusive insights from XenorAi. Subscribe to get updates straight to your inbox.
                        </p>

                        {/* Email form */}
                        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl relative mb-2">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="Enter your email to subscribe"
                                disabled={state.submitting}
                                className="w-full rounded-full bg-white px-6 py-4 pr-48 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/60 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={state.submitting}
                                className="group absolute right-2 top-1/2 -translate-y-1/2 bg-[#F97518] text-white rounded-full py-2 px-4 cursor-pointer shadow-lg flex justify-center items-center hover:bg-[#e86b13] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="mr-2 text-[16px] whitespace-nowrap">
                                    {state.submitting ? 'Submitting...' : 'Subscribe'}
                                </span>
                                <ArrowRight className="w-5 h-5 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            <Popup
                open={popupOpen}
                type={popupType}
                title={popupType === 'success' ? 'Success!' : 'Error'}
                message={
                    popupType === 'success'
                        ? "Thanks for subscribing! You'll receive the latest XenorAi updates straight to your inbox."
                        : "Oops! Something went wrong. Please double-check your email and try again."


                }
                onClose={() => setPopupOpen(false)}
            />
        </section>
    );
}
