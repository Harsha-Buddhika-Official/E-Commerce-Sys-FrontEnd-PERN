import { useState, useEffect } from "react";

const slides = [
  "https://res.cloudinary.com/dlolgk9bo/image/upload/v1777403096/Gemini_Generated_Image_qc11lkqc11lkqc11_nf2wfg.png",
  "https://res.cloudinary.com/dlolgk9bo/image/upload/v1777403087/Gemini_Generated_Image_vw1evyvw1evyvw1e_xxmlhx.png",
  "https://res.cloudinary.com/dlolgk9bo/image/upload/v1777403045/Gemini_Generated_Image_s01jm7s01jm7s01j_zizumq.png"
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16 / 9', maxHeight: 'calc(100vh - 60px)' }}
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
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`rounded-full transition-all duration-300 ${
              current === index
                ? "bg-red-600 h-2 sm:h-3 md:h-4 w-6 sm:w-8 md:w-10 lg:w-12"
                : "h-2 sm:h-3 md:h-4 w-2 sm:w-3 md:w-4 bg-red-600 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

