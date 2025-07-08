import React from 'react'

export const Header1 = ({children, className = "text-primary text-3xl"}) => {
  return (
    <h1 className={`font-bold ${className}`}>{children}</h1>
  )
}

export const Header2 = ({children, className = "text-primary text-2xl"}) => {
    return (
      <h2 className={`font-bold ${className}`}>{children}</h2>
    )
}

export const Header3 = ({children, className= "text-primary text-xl"}) => {
    return (
      <h3 className={`font-bold ${className}`}>{children}</h3>
    )
}