import React from 'react'
import Icon from './Icon'

export const LabelPrimary = ({children, icon}) => {
  return (
    <div className='flex items-center text-sm w-fit rounded-md px-2 py-0.5 bg-primary text-white'>
  {icon ? <Icon variant={icon} size="16" className='mr-1' /> : ""}
  {children}
</div>
  )
}

export const LabelSecondary = ({children}) => {
    return (
      <div className='text-sm w-fit rounded-md px-2 py-0.5 bg-secondary text-white'>{children}</div>
    )
  }