import { Header1 } from "../_atoms/Headers";
import { CareerCard } from "../_molecules/careerCard";
import { OutlinedButton } from "../_atoms/buttons";
import Link from "next/link";

const LearningPathwayComponent = ({ careers, titleContent, link }) => {
  return (
    <div className="w-full my-2">
      <div className="px-4 py-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mt-8 px-2">
          <Header1>{titleContent?.title}</Header1>
          {titleContent?.subtitle && (
            <p
              className="text-muted-foreground mt-2"
              dangerouslySetInnerHTML={{ __html: titleContent.subtitle }}
            />
          )}
        </div>

        <div className="grid gap-4 mt-6 justify-center [grid-template-columns:repeat(auto-fit,minmax(280px,300px))]">
          {careers.map((career, index) => (
            <CareerCard key={index} {...career} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href={link}>
            <OutlinedButton
              label={titleContent?.buttonText}
              className="bg-white"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningPathwayComponent;
