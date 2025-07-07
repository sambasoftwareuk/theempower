import React from 'react'
import { FAQSection } from '../_molecules/faqSection'

const TheEmpowerFaq = ({faqData}) => {
  return (
    <div className='w-full'>
      <FAQSection faqData={faqData} />
    </div>
  )
}

export default TheEmpowerFaq