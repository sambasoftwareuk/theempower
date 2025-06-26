"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "../_atoms/Icons";
import { DirectionButton } from "../_atoms/buttons";
import Icon from "../_atoms/Icon";

export const CarouselSlider = ({
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

  const childArray = useMemo(() => React.Children.toArray(children), [children] );
  const totalSlides = Math.ceil(childArray.length / itemsPerSlide);
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
  }, [childArray]);

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
            <DirectionButton
          icon={<Icon variant={ChevronLeft} size={32} />}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow"
          onClick={scrollLeft}
        />
          </div>
        )}

        {showArrows && canScrollRight && (
          
            <DirectionButton
          icon={<Icon variant={ChevronRight} size={32} />}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow"
          onClick={scrollRight}
        />
          
        )}

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-8 py-2">
          <div className="flex gap-2">
            {childArray.map((child, i) => (
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
       
          <DirectionButton
          icon={<Icon variant={ChevronLeft} size={32} />}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow z-10"
          onClick={prevSlide}
        />
      )}

      {showArrows && currentIndex < totalSlides - 1 && (
        
          <DirectionButton
          icon={<Icon variant={ChevronRight} size={32} />}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow z-10"
          onClick={nextSlide}
        />
        
      )}

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`,
            width: `${(childArray.length / itemsPerSlide) * 100}%`,
          }}
        >
          {childArray.map((child, i) => (
            <div
              key={i}
              style={{ flex: `0 0 ${100 / childArray.length}%` }}
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

export const ImageSlider = ({
  size = "sm",
  children,
  variant,
  showDots = true,
  showArrows = true,
}) => {
  const [index, setIndex] = useState(0)
  const items = Array.isArray(children) ? children : [children]
  const intervalRef = useRef(null)

  const isAutoSlide = variant === 'autoSlide'
  const showByIndex = typeof variant === 'undefined'
  const alwaysShowControls = variant === 'infinite' || isAutoSlide

  const showLeft = showArrows && (alwaysShowControls || (showByIndex && index > 0))
  const showRight = showArrows && (alwaysShowControls || (showByIndex && index < items.length - 1))

  const next = () => setIndex((prev) => (prev + 1) % items.length)
  const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length)
  const goTo = (i) => setIndex(i)

  // Auto Slide Effect
  useEffect(() => {
    if (isAutoSlide) {
      intervalRef.current = setInterval(next, 5000)
      return () => clearInterval(intervalRef.current)
    }
  }, [isAutoSlide])

  return (
    <div className="relative w-full overflow-hidden mx-auto">
      {/* Slider container */}
      <div
        className={`flex w-full ${size === "sm" ? "h-[250px]" : size === "md" ? "h-[300px]" : size === "lg" ? 'h-[600px]' : "" } transition-transform duration-500 ease-in-out`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((child, i) => (
          <div key={i} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full ${
                i === index ? 'bg-black' : 'bg-gray-300'
              } transition-colors duration-300`}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      {showLeft && (
        <DirectionButton
          icon={<Icon variant={ChevronLeft} size={32} />}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow"
          onClick={prev}
        />
      )}
      {showRight && (
        <DirectionButton
          icon={<Icon variant={ChevronRight} size={32} />}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow"
          onClick={next}
        />
      )}
    </div>
  )
};