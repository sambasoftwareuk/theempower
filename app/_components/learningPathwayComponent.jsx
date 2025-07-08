import React from "react";
import { Header1 } from "../_atoms/Headers";
import { CareerCard } from "../_molecules/careerCard";
import { OutlinedButton } from "../_atoms/buttons";

const LearningPathwayComponent = ({ careers, titleContent }) => {
  return (
    <div>
      <div className="flex flex-col justify-center mt-8">
        <Header1>{titleContent?.title}</Header1>
        {titleContent?.subtitle && (
          <p
            className="text-muted-foreground mt-2"
            dangerouslySetInnerHTML={{ __html: titleContent.subtitle }}
          />
        )}
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
        <OutlinedButton label={titleContent?.buttonText} />
      </div>
    </div>
  );
};

export default LearningPathwayComponent;
