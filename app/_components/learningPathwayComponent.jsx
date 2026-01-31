import { Header1 } from "../_atoms/Headers";
import { CareerCard } from "../_molecules/careerCard";
import { OutlinedButton } from "../_atoms/buttons";
import Link from "next/link";

const LearningPathwayComponent = ({ careers, titleContent, link }) => {
  const someCareers = careers.slice(0, 3);
  return (
    <div className="w-full my-2">

    <div className="px-4 py-6 w-3/5 mx-auto">
      {/* Başlık ve Alt Başlık */}
      <div className="flex flex-col items-center text-center mt-8 px-2">
        <Header1>{titleContent?.title}</Header1>
        {titleContent?.subtitle && (
          <p
            className="text-muted-foreground mt-2"
            dangerouslySetInnerHTML={{ __html: titleContent.subtitle }}
          />
        )}
      </div>

      {/* Career Cards */}
      <div className="flex flex-wrap gap-4 justify-center items-center mt-6">
        {someCareers.map((career, index) => (
          <div
            key={index}
            className="w-full sm:w-[48%] lg:w-[30%] flex justify-center"
          >
            <CareerCard {...career} />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-6">
        <Link href={link}>
          <OutlinedButton label={titleContent?.buttonText} className="bg-white"/>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default LearningPathwayComponent;
