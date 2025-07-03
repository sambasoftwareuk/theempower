import React from "react";
import { Header2 } from "../_atoms/Headers";
import { CardWithIcon } from "../_molecules/cardWithIcon";
import Image from "next/image";
import { Certificate } from "../_atoms/Icons";
import goalsData from "../mocks/goals.json";

const GoalsComponent = () => {
  return (
    <div className="flex flex-col w-full my-4">
      <div>
        <Header2>All the Essentials for Newcomers.</Header2>
      </div>
      <div className="hidden md:flex flex-row justify-between items-center w-full my-4 gap-12">
        <div>
          {goalsData.map((goal, index) => (
            <div key={index} className="mb-2">
              <CardWithIcon
                icon={Certificate}
                title={goal.title}
                description={goal.description}
                badge={goal.badge}
                linkText={goal.linkText}
                linkHref={goal.linkHref}
              />
            </div>
          ))}
        </div>
        <div>
          <Image
            src="/computer.jpg"
            alt="Screen Capture"
            height={400}
            width={600}
          />
        </div>
      </div>
      <div className="md:hidden flex flex-col items-center justify-center w-full my-4">
        <Image
          src="/computer.jpg"
          alt="Screen Capture"
          height={400}
          width={600}
        />
      </div>
    </div>
  );
};

export default GoalsComponent;
