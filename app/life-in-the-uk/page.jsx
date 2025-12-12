import settlement from "../mocks/settlement.json";
import { Header1 } from "../_atoms/Headers";
import { CareerCard } from "../_molecules/careerCard";

const Page = () => {
  return (
    <div className="px-4 py-10 mx-auto max-w-7xl ">
      <div className="text-center mb-10">
        <Header1>LIFE IN THE UK</Header1>
      </div>

      <div
        className="grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
          place-content-center   
          justify-items-center   
          items-strech
        "
      >
        {settlement.map((set, id) => (
          <CareerCard key={id} {...set} />
        ))}
      </div>
    </div>
  );
};

export default Page;
