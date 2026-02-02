export const dynamic = "force-dynamic";
import LearningPathwayComponent from "./_components/learningPathwayComponent";
import MainTabComponent from "./_components/mainTabComponent";
import ReferenceComponent from "./_components/referanceComponent";
import tabs from "./mocks/tabs";
import potentials from "./mocks/potentials.json";
import settlement from "./mocks/settlement.json";
import mainPageTitle from "./mocks/mainPageTitles.json";
import testimonialData from "./mocks/testimonial.json";
import referenceImages from "./mocks/referenceImages.json";
import GoalsComponent from "./_components/goalsComponent";
import TestimonialComponent from "./_components/testimonialComponent";
import SkillsSection from "./_components/skillsSection";
import coursesFromMock from "./mocks/courses.json";
import events from "./mocks/events.json";
import latestUpdates from "./mocks/latestUpdates.json";
import { FAQSection } from "./_components/faqSection";
import faqData from "./mocks/empowerFaq.json";
import CarouselSliderComponent from "./_components/carouselSliderComponent";
import ImageSliderBeComponent from "./_components/ImageSliderBeComponent";


export default function Home() {

  const { mockCourses } = coursesFromMock;
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
      <ImageSliderBeComponent/>
      <LearningPathwayComponent
        careers={potentials}
        titleContent={mainPageTitle.potentialPathway}
        link="/job-and-employability"
      />
      <LearningPathwayComponent
        careers={settlement}
        titleContent={mainPageTitle.settlementPathway}
        link="/life-in-the-uk"
      />

      <GoalsComponent titleContent={mainPageTitle.goalsComponent} />
      <TestimonialComponent
        testimonialData={testimonialData}
        titleContent={mainPageTitle.testimonialPathway}
      />
      <CarouselSliderComponent
        titleContent={mainPageTitle?.latestUpdates}
        data={latestUpdates}
        isAutoSlide={false}
        isInfinite={false}
        showArrows={true}
      />
      <SkillsSection
        courses={mockCourses}
        titleContent={mainPageTitle.skillsSection}
      />

      <CarouselSliderComponent
        titleContent={mainPageTitle.events}
        data={events}
        isAutoSlide={false}
        isInfinite={false}
        showArrows={true}
      />
      <ReferenceComponent
        referenceImages={referenceImages}
        titleContent={mainPageTitle?.referenceComponent}
      />
      <FAQSection faqData={faqData} titleContent={mainPageTitle.faqComponent} />
    </div>
  );
}
