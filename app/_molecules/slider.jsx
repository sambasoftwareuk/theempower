'use client'

import { useState } from 'react'
import { DirectionButton } from '../_atoms/buttons'
import Icon from '../_atoms/Icon'
import { ChevronLeft, ChevronRight } from '../_atoms/Icons'

export default function Slider({ children, variant }) {
  const [index, setIndex] = useState(0)
  const items = Array.isArray(children) ? children : [children]

  const next = () => setIndex((index + 1) % items.length)
  const prev = () => setIndex((index - 1 + items.length) % items.length)

  const showByIndex = typeof variant === 'undefined'
  const alwaysShowControls = variant === 'indefinite'

  const showLeft = alwaysShowControls || (showByIndex && index > 0)
  const showRight = alwaysShowControls || (showByIndex && index < items.length - 1)

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
}
