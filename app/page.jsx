import ImageSliderComponent from "./_components/imageSliderComponent";
import LearningPathwayComponent from "./_components/learningPathwayComponent";
import MainTabComponent from "./_components/mainTabComponent";
import ReferenceComponent from "./_components/referanceComponent";
import tabs from "./mocks/tabs";
import potentials from "./mocks/potentials.json";
import settlement from "./mocks/settlement.json";
import mainPageTitle from "./mocks/mainPageTitles.json";
import images from "./mocks/images";
import sliderData from "./mocks/sliderData.json";
import testimonialData from "./mocks/testimonial.json";
import referenceImages from "./mocks/referenceImages.json";
import PopularContentsComponent from "./_components/populerContentsComponent";
import GoalsComponent from "./_components/goalsComponent";
import TestimonialComponent from "./_components/testimonialComponent";
import SkillsSection from "./_components/skillsSection";
import coursesFromMock from "./mocks/courses.json";
import Events from "./_components/events";

export default function Home() {
  const { mockCourses } = coursesFromMock;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ImageSliderComponent
        images={images}
        sliderData={sliderData}
        size={"md"}
      />
      <LearningPathwayComponent
        careers={potentials}
        titleContent={mainPageTitle.potentialPathway}
      />
      <LearningPathwayComponent
        careers={settlement}
        titleContent={mainPageTitle.settlementPathway}
      />
      <MainTabComponent tabs={tabs} />
      <PopularContentsComponent courses={mockCourses} />
      <GoalsComponent titleContent={mainPageTitle.goalsComponent} />
      <TestimonialComponent
        testimonialData={testimonialData}
        titleContent={mainPageTitle.testimonialPathway}
      />
      <SkillsSection courses={mockCourses} />
      <Events titleContent={mainPageTitle.events} />
      <ReferenceComponent referenceImages={referenceImages} titleContent={mainPageTitle.referenceComponent} />
    </div>
  );
}
