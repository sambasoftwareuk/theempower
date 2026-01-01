import React from 'react'
import { SambaLinks } from '../_atoms/SambaLinks'

const questions = ["Frequently asked questions", "Events", "Latest Updates & News", "Success Stories", "Application Guide & Documents", "Useful Sources & Links", "Guides & Tools", "Workshops & Support Sessions", "Contact us", "Blog", "Investors"]

const QuestionsSection = () => {
  return (
    <div className="bg-gray-950 border-t border-gray-700 py-6 px-6">
    <div>
      <ul className="space-y-1">
        {questions.map((text, i) => (
          <li key={i}>
            <SambaLinks color="white" underline="hover">
              {text}
            </SambaLinks>
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default QuestionsSection