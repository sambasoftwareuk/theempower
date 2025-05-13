import CourseCard from "../_molecules/courseCard";
import TabMenu from "../_molecules/tabMenu";
import tabs from "../mocks/tabs.json"


const page = () => {
  return (
    <div className="p-4">
      <CourseCard />
      <TabMenu tabs={tabs}/>
    </div>
  );
};

export default page;
