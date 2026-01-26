import ImageSliderComponent from "./_components/imageSliderComponent";
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
import {
  getMainSliderSlides,
  getFeaturedSlotWithContents,
} from "@/lib/queries";

export default async function Home() {
  const { mockCourses } = coursesFromMock;
  const slidesData = await getMainSliderSlides("main_page_slider", "en");
  const firstFeaturedData = await getFeaturedSlotWithContents(1, "en", {
    limit: 3,
  });
  const secondFeaturedData = await getFeaturedSlotWithContents(2, "en", {
    limit: 3,
  });
  const mainSliderImages = slidesData.map((slide) => ({
    alt: slide.image_alt || "",
    link: slide.image_link.replace("/", ""),
  }));

  const sliderData = slidesData.map((slide) => ({
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    body: slide.description || "",
    primaryLabel: null,
    secondaryLabel: null,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
      <ImageSliderComponent
        images={mainSliderImages}
        sliderData={sliderData}
        size={"lg"}
      />
      <LearningPathwayComponent
        careers={firstFeaturedData.items}
        titleContent={{
          title: firstFeaturedData.title,
          subtitle: firstFeaturedData.subtitle,
          buttonText: firstFeaturedData.cta_label
        }}
        link={firstFeaturedData.cta_link}
      />
      <LearningPathwayComponent
        careers={secondFeaturedData.items}
        titleContent={{
          title: secondFeaturedData.title,
          subtitle: secondFeaturedData.subtitle,
          buttonText: secondFeaturedData.cta_label,
        }}
        link={secondFeaturedData.cta_link}
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
