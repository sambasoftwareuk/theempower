import React from 'react'
import { Header1 } from '../_atoms/Headers'
import { CareerCard } from '../_molecules/careerCard'
import { OutlinedButton } from '../_atoms/buttons'


const LearningPathwayComponent = ( {careers} ) => {
  return (
    <div>
         <div className="mt-4">
            <Header1>Ready to Unlock Your Potential and Empower Yourself?</Header1>
            <p><span className='font-bold'>This is your moment </span> — step forward, grow stronger, and shape your future with confidence.</p>
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
        <OutlinedButton label="Everything to Help You Thrive" />
      </div>
    </div>
  )
}

export default LearningPathwayComponent