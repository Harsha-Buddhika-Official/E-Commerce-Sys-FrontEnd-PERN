import { useState, useEffect } from "react";
import Image1 from "../Assets/Slider/Image1.png";
import Image2 from "../Assets/Slider/Image2.png";
import Image3 from "../Assets/Slider/Image3.png";

const slides = [Image1, Image2, Image3];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full max-w-[1920px] mx-auto overflow-hidden"
      style={{ height: 'min(calc(100vh - 60px), 1020px)' }}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover object-center flex-shrink-0"
          />
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-white scale-125"
                : "bg-gray-400 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
 
