import ReferenceComponent from "./referanceComponent";
import mainPageTitle from "../mocks/mainPageTitles.json";
import testimonialData from "../mocks/testimonial.json";
import referenceImages from "../mocks/referenceImages.json";
import GoalsComponent from "./goalsComponent";
import TestimonialComponent from "./testimonialComponent";
import SkillsSection from "./skillsSection";
import coursesFromMock from "../mocks/courses.json";
import events from "../mocks/events.json";
import latestUpdates from "../mocks/latestUpdates.json";
import { FAQSection } from "./faqSection";
import faqData from "../mocks/empowerFaq.json";
import CarouselSliderComponent from "./carouselSliderComponent";
import ImageSliderBeComponent from "./ImageSliderBeComponent";
import FirstFeaturedComponente from "./FirstFeaturedComponent";
import SecondFeaturedComponent from "./SecondFeaturedComponent";
import { getEssentials } from "@/lib/queries";

export default async function HomePageContent() {
    const { mockCourses } = coursesFromMock;
    let essentials = [];
try {
  essentials = await getEssentials();
} catch (e) {
  console.error("Essentials load failed:", e);
}
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
        <ImageSliderBeComponent/>
        <FirstFeaturedComponente/>
        <SecondFeaturedComponent/>
        <GoalsComponent titleContent={mainPageTitle.goalsComponent} goalsData={essentials}/>
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
    )
  }