import React from 'react'

export const Header1 = ({children}) => {
  return (
    <h1 className={`text-primary font-bold text-3xl`}>{children}</h1>
  )
}

export const Header2 = ({children}) => {
    return (
      <h2 className={`font-bold text-primary text-2xl`}>{children}</h2>
    )
}

export const Header3 = ({children}) => {
    return (
      <h3 className={`font-bold text-primary text-xl`}>{children}</h3>
    )
}