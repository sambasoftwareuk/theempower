import React from 'react'
import { SambaLinks } from '../_atoms/SambaLinks'

const questions = ["Frequently asked questions", "Events", "Latest Updates & News", "Success Stories", "Application Guide & Documents", "Useful Sources & Links", "Guides & Tools", "Workshops & Support Sessions", "Contact us", "Blog", "Investors"]

const QuestionsSection = () => {
  return (
    <div className="bg-[#0E4A8C] border-t border-gray-700 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-white font-semibold text-lg mb-1">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
          {questions.map((text, i) => (
            <div
              key={i}
              className="group"
            >
              <SambaLinks 
                color="secondary200" 
                underline="hover"
                className="block py-0.5 px-3 rounded-lg hover:bg-[#42A5F5] hover:text-white transition-colors duration-200 text-sm"
              >
                {text}
              </SambaLinks>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuestionsSection