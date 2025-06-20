import ImageSliderComponent from "./components/imageSliderComponent";
import LearningPathwayComponent from "./components/learningPathwayComponent";
import MainTabComponent from "./components/mainTabComponent";
import ReferenceComponent from "./components/referanceComponent";
import tabs from "./mocks/tabs";
import careers from "./constants/careers.json";
import images from "./constants/images";
import referanceImages from "./constants/referanceImages";
import PopularContentsComponent from "./components/populerContentsComponent";
import GoalsComponent from "./components/goalsComponent";
import TestimonialComponent from "./components/testimonialComponent";
import SkillsSection from "./components/skillsSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ImageSliderComponent images={images} />
      <LearningPathwayComponent careers={careers} />
      <MainTabComponent tabs={tabs} />
      <ReferenceComponent referanceImages={referanceImages} />
      <PopularContentsComponent />
      <GoalsComponent />
      <TestimonialComponent />
      <SkillsSection/>
    </div>
  );
}
