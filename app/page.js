import CourseCard from "./_molecules/CourseCard";
import { CardWithIcon } from "./_molecules/cardWithIcon";
import { Certificate } from "./_atoms/Icons";

export default function Home() {
  return (
    <div className="m-4 ">
      <CourseCard />
      <div className="mt-5">
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
  );
}
