"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "../_atoms/Icons";
import { DirectionButton } from "../_atoms/buttons";


export const ImageSlider = ({
  children,
  itemsPerSlide = 1,
  showArrows = true,
  showDots = false,
  variant = "slide",
}) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const totalSlides = Math.ceil(children.length / itemsPerSlide);
  const isScrollMode = variant === "scroll";

  // Scroll Mode Arrow Visibility
  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  useEffect(() => {
    if (isScrollMode && scrollRef.current) {
      checkScroll();
      const el = scrollRef.current;
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [children]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const goToSlide = (index) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  // Scroll variant
  if (isScrollMode) {
    return (
      <div className="relative w-full">
        {showArrows && canScrollLeft && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <DirectionButton onClick={scrollLeft}>
              <ChevronLeft size={20} />
            </DirectionButton>
          </div>
        )}

        {showArrows && canScrollRight && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <DirectionButton onClick={scrollRight}>
              <ChevronRight size={20} />
            </DirectionButton>
          </div>
        )}

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-8 py-2">
          <div className="flex gap-2">
            {children.map((child, i) => (
              <div key={i} className="shrink-0">{child}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Slide variant
  return (
    <div className="relative w-full">
      {showArrows && currentIndex > 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <DirectionButton onClick={prevSlide}>
            <ChevronLeft size={20} />
          </DirectionButton>
        </div>
      )}
      {showArrows && currentIndex < totalSlides - 1 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <DirectionButton onClick={nextSlide}>
            <ChevronRight size={20} />
          </DirectionButton>
        </div>
      )}

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`,
            width: `${(children.length / itemsPerSlide) * 100}%`,
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              style={{ flex: `0 0 ${100 / children.length}%` }}
              className="w-full"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showDots && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
