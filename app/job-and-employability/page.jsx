import React from "react";
import { CareerCard } from "../_molecules/careerCard";
import potentials from "../mocks/potentials.json";
import { Header1 } from "../_atoms/Headers";

const page = () => {
  return (
    <div className="px-4  py-10 mx-auto max-w-7xl">
      <div className="text-center mb-10">
        <Header1>JOB & EMPLOYABILITY</Header1>
      </div>
      <div
        className="grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
          place-content-center   
          justify-items-center   
          items-strech "
      >
        {potentials.map((career, id) => (
          <CareerCard key={id} {...career} />
        ))}
      </div>
    </div>
  );
};

export default page;
