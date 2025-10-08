"use client"

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slides, Slide } from '@/data/sliderData'; // Assuming sliderData is in src/data

// Default interval for slides without a specific interval
const DEFAULT_INTERVAL = 4000; // 4 seconds

export const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Function to move to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-play effect
  useEffect(() => {
    const slide = slides[currentSlide];
    // Use the slide's specific interval or the default one
    const intervalTime = slide.interval || DEFAULT_INTERVAL; 

    const timer = setInterval(() => {
      nextSlide();
    }, intervalTime);

    // Clear interval on unmount or when currentSlide changes
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-2xl mx-auto max-w-7xl">
      {/* Slides Container (using translation for carouse effect) */}
      <div 
        className="flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide: Slide, index: number) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            {/* Image (Next.js <Image> would be preferred here for optimization) */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full object-cover h-[450px] md:h-[550px] lg:h-[650px]"
            />
            
            {/* Caption Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-end p-6 md:p-12">
              <div className="text-white">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg">
                  {slide.title}
                </h3>
                <p className="text-lg md:text-xl font-medium drop-shadow-md max-w-xl">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Shadcn Button style) */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/30 text-white hover:bg-white/50 transition-all z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/30 text-white hover:bg-white/50 transition-all z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              index === currentSlide ? 'bg-red-500 w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};