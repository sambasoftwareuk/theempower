'use client'

import { useState } from 'react'
import { DirectionButton } from '../_atoms/buttons'
import Icon from '../_atoms/Icon'
import { ChevronLeft, ChevronRight } from '../_atoms/Icons'

export default function Slider({ children }) {
  const [index, setIndex] = useState(0)
  const items = Array.isArray(children) ? children : [children]

  const next = () => setIndex((index + 1) % items.length)
  const prev = () => setIndex((index - 1 + items.length) % items.length)

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
       <DirectionButton icon={<Icon variant={ChevronLeft} size={32}/>} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow" onClick={prev}/>
       <DirectionButton icon={<Icon variant={ChevronRight} size={32}/>} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow" onClick={next}/>

    </div>
  )
}
