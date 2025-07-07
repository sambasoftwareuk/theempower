import React from 'react'
import { FAQSection } from '../_molecules/faqSection'

const TheEmpowerFaq = ({faqData, titleContent}) => {
  return (
    <div className='w-full'>
      <FAQSection faqData={faqData} titleContent={titleContent} />
    </div>
  )
}

export default TheEmpowerFaq