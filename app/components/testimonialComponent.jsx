import React from 'react'
import { TestimonialCard } from '../_molecules/testimonialCard'
import { Header2 } from '../_atoms/Headers'

const TestimonialComponent = () => {
  return (
    <div>
        <Header2>What our learners say</Header2>
        <div className="flex flex-row w-full my-4">
            <TestimonialCard
                    quote="The Empower gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role."
                    authorName="William Wallace"
                    authorTitle="Partner Account Manager at Samba Web Services"
                    authorImage="/images/testimonials/william.png"
                    courseLink="/aws-course"
                    courseTitle="View this AWS course"
                  />
            <TestimonialCard
                    quote="The Empower gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role."
                    authorName="William Wallace"
                    authorTitle="Partner Account Manager at Samba Web Services"
                    authorImage="/images/testimonials/william.png"
                    courseLink="/aws-course"
                    courseTitle="View this AWS course"
                  />
            <TestimonialCard
                    quote="The Empower gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role."
                    authorName="William Wallace"
                    authorTitle="Partner Account Manager at Samba Web Services"
                    authorImage="/images/testimonials/william.png"
                    courseLink="/aws-course"
                    courseTitle="View this AWS course"
                  />
    
            
        </div>
    </div>
)
}

export default TestimonialComponent