import { useState, useEffect } from 'react';
import { useBanner } from '../features/banners/hooks/useBanner.js';

export default function ImageSlider() {
    const { banners, loading, error } = useBanner();
    const [current, setCurrent] = useState(0);

    const slides = banners.map(banner => banner.media_url);

    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 10000);

        return () => clearInterval(timer);
    }, [slides.length]);

    if (loading) {
        return (
            <div
                className="w-full bg-gray-200 animate-pulse"
                style={{
                    aspectRatio: '16 / 9',
                    maxHeight: 'calc(100vh - 60px)'
                }}
            />
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-60">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{
                aspectRatio: '16 / 9',
                maxHeight: 'calc(100vh - 60px)'
            }}
        >
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${current * 100}%)`
                }}
            >
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full shrink-0 object-cover object-center"
                    />
                ))}
            </div>

            {/* Navigation Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-4 md:bottom-6">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`rounded-full transition-all duration-300 ${
                                current === index
                                    ? 'bg-red-600 h-2 sm:h-3 md:h-4 w-6 sm:w-8 md:w-10'
                                    : 'bg-red-600 hover:bg-white h-2 sm:h-3 md:h-4 w-2 sm:w-3 md:w-4'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}