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
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{
                        background: '#ffffff',
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    {/* Top progress line */}
                    <motion.div
                        className="absolute top-0 left-0 h-[2px]"
                        style={{ background: '#f97518' }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />

                    {/* Soft ambient glow top-right */}
                    <div
                        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 100% 0%, rgba(249,117,24,0.06), transparent 60%)',
                        }}
                    />
                    {/* Soft ambient glow bottom-left */}
                    <div
                        className="absolute bottom-0 left-0 w-[350px] h-[350px] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 0% 100%, rgba(249,117,24,0.04), transparent 60%)',
                        }}
                    />

                    {/* Center content */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="relative z-10 flex flex-col items-center gap-10"
                    >
                        {/* Logo with single clean spinner ring */}
                        <div className="relative w-48 h-48">
                            <motion.div
                                className="absolute rounded-full"

                            />
                            <Image
                                src="/logo2.png"
                                alt="XenorAi Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Progress bar + percentage */}
                        <div className="flex flex-col items-center gap-3" style={{ width: '190px' }}>
                            <div
                                className="relative w-full rounded-full overflow-hidden"
                                style={{ height: '5px', background: 'rgba(249,117,24,0.1)' }}
                            >
                                <motion.div
                                    className="absolute top-0 left-0 h-full rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #f97518, #ea5a00)' }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut" }}
                                />
                            </div>

                            <span
                                style={{
                                    fontSize: '11px',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(0,0,0,0.28)',
                                    fontWeight: 500,
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {progress}%
                            </span>
                        </div>
                    </motion.div>

                    {/* Bottom copyright */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="absolute bottom-8"
                        style={{
                            fontSize: '10px',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'rgba(0,0,0,0.16)',
                            fontWeight: 500,
                        }}
                    >
                        © 2026 XenorAi
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;