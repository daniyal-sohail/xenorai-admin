import React, { useEffect, useState } from 'react';
import { cn } from "../../lib/utils";

const MovingCards = () => {
    const [start, setStart] = useState(false);

    const productImages = [
        "/cards/img1.jpg", "/cards/img2.jpg", "/cards/img3.jpg", "/cards/img4.jpg", "/cards/img5.jpg",
        "/cards/img6.jpg", "/cards/img7.jpg", "/cards/img8.jpg", "/cards/img9.jpg", "/cards/img10.jpg",
        "/cards/img1.jpg", "/cards/img2.jpg", "/cards/img3.jpg", "/cards/img4.jpg", "/cards/img5.jpg",
        "/cards/img6.jpg", "/cards/img7.jpg", "/cards/img8.jpg", "/cards/img9.jpg", "/cards/img10.jpg",
    ];

    useEffect(() => {
        setStart(true);
    }, []);

    const getColumnImages = (columnIndex: any) => {
        const imagesPerColumn = Math.ceil(productImages.length / 3);
        const startIndex = columnIndex * imagesPerColumn;
        const columnImages = productImages.slice(startIndex, startIndex + imagesPerColumn);
        return [...columnImages, ...columnImages, ...columnImages];
    };

    return (
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-black lg:grid overflow-hidden">
            <div className="relative w-full h-full">
                {/* Moving Cards Container with overall rotation */}
                <div
                    className="absolute inset-0 overflow-hidden z-10 origin-center"
                    style={{ transform: 'rotate(6deg)' }}
                >
                    <div className="flex h-full gap-4 p-4">
                        {/* Column 1 */}
                        <div className="flex-1 relative overflow-hidden">
                            <div className={cn("flex flex-col gap-4", start && "animate-scroll-up")}>
                                {getColumnImages(0).map((imgPath, index) => (
                                    <div
                                        key={`col1-${index}`}
                                        className="w-full aspect-[4/2] overflow-hidden rounded-lg shadow-lg"
                                    >
                                        <img
                                            src={imgPath}
                                            alt="Digital Product"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="flex-1 relative overflow-hidden">
                            <div className={cn("flex flex-col gap-4", start && "animate-scroll-down")}>
                                {getColumnImages(1).map((imgPath, index) => (
                                    <div
                                        key={`col2-${index}`}
                                        className="w-full aspect-[4/2] overflow-hidden rounded-lg shadow-lg"
                                    >
                                        <img
                                            src={imgPath}
                                            alt="Digital Product"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="flex-1 relative overflow-hidden">
                            <div className={cn("flex flex-col gap-4", start && "animate-scroll-up")}>
                                {getColumnImages(2).map((imgPath, index) => (
                                    <div
                                        key={`col3-${index}`}
                                        className="w-full aspect-[4/2] overflow-hidden rounded-lg shadow-lg"
                                    >
                                        <img
                                            src={imgPath}
                                            alt="Digital Product"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-black/90 z-15"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40 z-16"></div>

                {/* Logo */}
                <div className="absolute top-6 left-6 flex items-center z-20">
                    <div className="bg-red-600 w-10 h-10 flex items-center justify-center rounded-lg mr-3 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-white text-2xl font-bold tracking-wide">SELLRGRID</span>
                </div>

                {/* Headline */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                        PREMIUM DIGITAL PRODUCTS<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                            AT YOUR FINGERTIPS
                        </span>
                    </h1>
                    <p className="text-md md:text-lg text-gray-200 max-w-3xl leading-relaxed">
                        Discover, learn, and build with expert knowledge from successful entrepreneurs
                    </p>
                </div>

                {/* CSS Animations */}
                <style jsx>{`
                    @keyframes scroll-up {
                        0% {
                            transform: translateY(0);
                        }
                        100% {
                            transform: translateY(-33.33%);
                        }
                    }

                    @keyframes scroll-down {
                        0% {
                            transform: translateY(-33.33%);
                        }
                        100% {
                            transform: translateY(0);
                        }
                    }

                    .animate-scroll-up {
                        animation: scroll-up 30s linear infinite;
                    }

                    .animate-scroll-down {
                        animation: scroll-down 30s linear infinite;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default MovingCards;
