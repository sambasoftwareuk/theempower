import React from 'react'

export const HeaderH1 = ({children}) => {
  return (
    <h1 className="text-3xl font-bold text-primary">{children}</h1>
  )
}

export const HeaderH2 = ({children}) => {
    return (
      <h2 className="text-2xl font-bold text-primary">{children}</h2>
    )
}

export const HeaderH3 = ({children}) => {
    return (
      <h2 className="text-xl font-bold text-primary">{children}</h2>
    )
}