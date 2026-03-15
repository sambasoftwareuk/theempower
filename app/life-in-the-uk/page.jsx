import settlement from "../mocks/settlement.json";
import { Header1 } from "../_atoms/Headers";
import { CareerCard } from "../_molecules/careerCard";
import { Breadcrumb } from "../_atoms/breadcrumb";
import { getI18n } from "@/locales/server";

const Page = async () => {
  const t = await getI18n();
  return (
    <div className="px-4 py-10 mx-auto max-w-7xl ">
      <Breadcrumb items={[{ label: t("lifeInTheUk"), href: "#" }]} />
      <div className="text-center mb-10">
        <Header1>{t("lifeInTheUk")}</Header1>
      </div>

      <div
        className="grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
          place-content-center   
          justify-items-center   
          items-stretch
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
