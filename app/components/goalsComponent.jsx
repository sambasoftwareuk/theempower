import React from "react";
import { Header2 } from "../_atoms/Headers";
import { CardWithIcon } from "../_molecules/cardWithIcon";
import { Certificate } from "../_atoms/Icons";
import Image from "next/image";

const GoalsComponent = () => {
  return (
    <div className="flex flex-col w-full my-4">
      <div>
        <Header2>Achieve your goals with Empower</Header2>
      </div>
      <div className="flex flex-row justify-between items-center w-full my-4">
        <div>
          <div className="mb-2">
            <CardWithIcon
              icon={Certificate}
              title="Hands-on training"
              description="Upskill effectively with AI-powered coding exercises, practice tests, and quizzes."
              badge="Enterprise Plan"
              linkText="Explore courses"
              linkHref="#"
            />
          </div>
          <div className="mb-2">
            <CardWithIcon
              icon={Certificate}
              title="Hands-on training"
              description="Upskill effectively with AI-powered coding exercises, practice tests, and quizzes."
              badge="Enterprise Plan"
              linkText="Explore courses"
              linkHref="#"
            />
          </div>
          <div className="mb-2">
            <CardWithIcon
              icon={Certificate}
              title="Hands-on training"
              description="Upskill effectively with AI-powered coding exercises, practice tests, and quizzes."
              badge="Enterprise Plan"
              linkText="Explore courses"
              linkHref="#"
            />
          </div>
          <div className="mb-2">
            <CardWithIcon
              icon={Certificate}
              title="Hands-on training"
              description="Upskill effectively with AI-powered coding exercises, practice tests, and quizzes."
              badge="Enterprise Plan"
              linkText="Explore courses"
              linkHref="#"
            />
          </div>
        </div>
        <div><Image src="/screenCapture.png" alt="Screen Capture" height={400} width={600} /></div>
      </div>
    </div>
  );
};

export default GoalsComponent;
