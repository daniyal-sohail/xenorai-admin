"use client";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }

        // Animate progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 18);

        const timer = setTimeout(() => {
            setVisible(false);
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        }, 1800);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{
                        background: '#ffffff',
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    {/* Subtle grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(249,117,24,1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(249,117,24,1) 1px, transparent 1px)
                            `,
                            backgroundSize: '60px 60px',
                        }}
                    />

                    {/* Top accent line */}
                    <motion.div
                        className="absolute top-0 left-0 h-[3px]"
                        style={{ background: 'linear-gradient(90deg, #f97518, #ea5a00)' }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />

                    {/* Decorative circle blobs */}
                    <div
                        className="absolute top-[-120px] right-[-120px] w-[380px] h-[380px] rounded-full opacity-[0.06]"
                        style={{ background: 'radial-gradient(circle, #f97518, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-[-80px] left-[-80px] w-[280px] h-[280px] rounded-full opacity-[0.04]"
                        style={{ background: 'radial-gradient(circle, #f97518, transparent 70%)' }}
                    />

                    {/* Center content */}
                    <div className="relative z-10 flex flex-col items-center gap-10">

                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            className="flex flex-col items-center gap-6"
                        >
                            {/* Logo container with elegant ring */}
                            <div className="relative">
                                {/* Rotating ring */}
                                <motion.div
                                    className="absolute inset-[-14px] rounded-full"
                                    style={{
                                        border: '1.5px solid transparent',
                                        borderTopColor: '#f97518',
                                        borderRightColor: 'rgba(249,117,24,0.2)',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                />
                                {/* Outer static ring */}
                                <div
                                    className="absolute inset-[-14px] rounded-full"
                                    style={{ border: '1px solid rgba(249,117,24,0.08)' }}
                                />

                                {/* Logo box */}
                                <div
                                    className="relative w-48 h-48 rounded-2xl flex items-center justify-center"

                                >
                                    <Image
                                        src="/logo2.png"
                                        alt="XenorAi Logo"
                                        fill
                                        className="object-contain p-3"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Brand name */}

                        </motion.div>

                        {/* Progress section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="flex flex-col items-center gap-3 w-[220px]"
                        >
                            {/* Track */}
                            <div
                                className="relative w-full h-[2px] rounded-full overflow-hidden"
                                style={{ background: 'rgba(249,117,24,0.10)' }}
                            >
                                <motion.div
                                    className="absolute top-0 left-0 h-full rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #f97518, #ea5a00)' }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut" }}
                                />
                                {/* Shimmer */}
                                <motion.div
                                    className="absolute top-0 h-full w-[60px]"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                        left: `${progress - 10}%`,
                                    }}
                                />
                            </div>

                            {/* Loading label */}
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-1 h-1 rounded-full"
                                    style={{ background: '#f97518' }}
                                />
                                <span
                                    className="text-[11px] tracking-[0.18em] uppercase"
                                    style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}
                                >
                                    Loading
                                </span>
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                    className="w-1 h-1 rounded-full"
                                    style={{ background: '#f97518' }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom wordmark */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="absolute bottom-8 text-[10px] tracking-[0.2em] uppercase"
                        style={{ color: 'rgba(0,0,0,0.18)', fontWeight: 500 }}
                    >
                        © 2026 XenorAi
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;