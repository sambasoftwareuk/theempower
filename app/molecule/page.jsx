"use client";
import CourseCard from "../_molecules/courseCard";
import { CardWithIcon } from "../_molecules/cardWithIcon";
import SliderCard from "../_molecules/sliderCard";
import { Certificate } from "../_atoms/Icons";
import TabMenu from "../_molecules/tabMenu";
import tabs from "../mocks/tabs.json";
import { CareerCard } from "../_molecules/careerCard";
import { careers } from "../constants/careers";
import { SliderImage } from "../_atoms/images";
import { CarouselSlider, ImageSlider } from "../_molecules/slider";
import { TestimonialCard } from "../_molecules/testimonialCard";
import { LearnCard } from "../_molecules/learnCard";
import { FAQSection } from "../_molecules/faqSection";

const page = () => {
  return (
    <div className="p-4">
      <CourseCard />
      <SliderCard
        title="Her zaman bir adım önde olun"
        subtitle="En güncel yetkinlikleri öğrenerek başarıya ulaşın. Kurslar şimdi yalnızca €11,99'den başlayan fiyatlarla! İndirim 15 Mayıs'ta sona eriyor."
        primaryLabel="Hemen Başla"
        onPrimaryClick={() => console.log("Başla tıklandı")}
        secondaryLabel="Detaylar"
        onSecondaryClick={() => console.log("Detaylar tıklandı")}
      />
      <TestimonialCard
        quote="The Empower gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role."
        authorName="William Wallace"
        authorTitle="Partner Account Manager at Samba Web Services"
        authorImage="/images/testimonials/william.png"
        courseLink="/aws-course"
        courseTitle="View this AWS course"
      />
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

      <div className="mt-5">
        <TabMenu tabs={tabs} />

        <div className="flex flex-wrap gap-2 justify-center mt-5  ">
          {careers.map((career, index) => (
            <div key={index}>
              <CareerCard {...career} />
            </div>
          ))}
        </div>
        <FAQSection/>
      </div>
      <div className="mt-2">
        <ImageSlider>
          <SliderImage imageLink={"/1.png"} />
        </ImageSlider>
      </div>
      <div className="mt-2">
        <ImageSlider variant="infinite" showDots={true}>
          <SliderImage imageLink={"/learner-centered.jpg"} />
          <SliderImage />
          <SliderImage imageLink={"/1.png"} />
        </ImageSlider>
      </div>
      <div className="mt-2">
        <ImageSlider showDots={true}>
          <SliderImage imageLink={"/1.png"} />
          <SliderImage imageLink={"/learner-centered.jpg"} />
          <SliderImage />
        </ImageSlider>
      </div>
      <div className="mt-2">
        <ImageSlider variant={"autoSlide"} showDots={false} showArrows={false}>
          <SliderImage imageLink={"/1.png"} />
          <SliderImage imageLink={"/learner-centered.jpg"} />
          <SliderImage />
        </ImageSlider>
      </div>
      <div className="mt-2">
        <ImageSlider variant={"autoSlide"} showDots={true} showArrows={false}>
          <SliderImage imageLink={"/1.png"} />
          <SliderImage imageLink={"/learner-centered.jpg"} />
          <SliderImage />
        </ImageSlider>
      </div>
      <div className="mt-2">
        <ImageSlider variant={"autoSlide"} showDots={false} showArrows={true}>
          <SliderImage imageLink={"/1.png"} />
          <SliderImage imageLink={"/learner-centered.jpg"} />
          <SliderImage />
        </ImageSlider>
      </div>
      <LearnCard />
    </div>
  );
};

export default page;
