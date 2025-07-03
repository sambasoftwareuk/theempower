import React from 'react'
import { Header1 } from '../_atoms/Headers'
import { CareerCard } from '../_molecules/careerCard'
import { OutlinedButton } from '../_atoms/buttons'


const LearningPathwayComponent = ( {careers, titleContent} ) => {
  function formatSubtitle(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, index) =>
        index % 2 === 1 ? <span key={index} className="font-bold">{part}</span> : part
      )}
    </span>
  );
}

  return (
    <div>
         <div className="mt-8">
            <Header1>{titleContent.title}</Header1>
            <p>{formatSubtitle(titleContent.subtitle)}</p>
          </div>
          <div>
            <div className="flex-row flex gap-2 justify-center mt-5">
              {careers.map((career, index) => (
                <div key={index}>
                  <CareerCard {...career} />
                </div>
              ))}
            </div>
          </div>
          <div className="my-4">
        <OutlinedButton label={titleContent.buttonText} />
      </div>
    </div>
  )
}

export default LearningPathwayComponent