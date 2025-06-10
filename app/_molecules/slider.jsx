'use client'

import { useEffect, useRef, useState } from 'react'
import { DirectionButton } from '../_atoms/buttons'
import Icon from '../_atoms/Icon'
import { ChevronLeft, ChevronRight } from '../_atoms/Icons'

export const ImageSlider = ({
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
        className="flex transition-transform duration-500 ease-in-out"
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