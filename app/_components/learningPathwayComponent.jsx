import { Header1 } from '../_atoms/Headers'
import { CareerCard } from '../_molecules/careerCard'
import { OutlinedButton } from '../_atoms/buttons'

const LearningPathwayComponent = ({ careers, titleContent }) => {
  function formatSubtitle(text) {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return (
      <span>
        {parts.map((part, index) =>
          index % 2 === 1 ? <span key={index} className="font-bold">{part}</span> : part
        )}
      </span>
    )
  }

  return (
    <div className="px-4 py-6">
      {/* Başlık ve Alt Başlık */}
      <div className="flex flex-col items-center text-center mt-8 px-2">
        <Header1>{titleContent?.title}</Header1>
        <p className="mt-2 text-base sm:text-lg">
          {formatSubtitle(titleContent?.subtitle)}
        </p>
      </div>

      {/* Career Cards */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mt-6">
        {careers.map((career, index) => (
          <div key={index} className="w-full sm:w-auto">
            <CareerCard {...career} />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-6">
        <OutlinedButton label={titleContent?.buttonText} />
      </div>
    </div>
  )
}

export default LearningPathwayComponent
