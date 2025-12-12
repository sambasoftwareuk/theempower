import { Header2 } from "../_atoms/Headers";
import { CardWithIcon } from "../_molecules/cardWithIcon";
import { CardImage } from "../_atoms/images";
import { Certificate } from "../_atoms/Icons";
import goalsData from "../mocks/goals.json";

const GoalsComponent = ({ titleContent }) => {
  return (
    <div className="flex flex-col  justify-center w-full my-8 px-4 sm:px-6">
      <div className="flex  items-center justify-center">
        <Header2>{titleContent?.title}</Header2>
      </div>
      <div className="hidden md:flex flex-row  items-center justify-center w-full my-4 gap-12">
        <div>
          {goalsData.map((goal, index) => (
            <div key={index} className="mb-2">
              <CardWithIcon
                icon={Certificate}
                title={goal?.title}
                description={goal?.description}
                badge={goal?.badge}
                linkText={goal?.linkText}
                linkHref={goal?.linkHref}
              />
            </div>
          ))}
        </div>
        <div>
          <CardImage imageLink="/computer.jpg" imageAlt="Screen Capture" />
        </div>
      </div>
      <div className="md:hidden flex flex-col items-center justify-center w-full my-4">
        <CardImage imageLink="/computer.jpg" imageAlt="Screen Capture" />
      </div>
    </div>
  );
};

export default GoalsComponent;
