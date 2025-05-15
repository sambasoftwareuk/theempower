"use client";
import CourseCard from "../_molecules/courseCard";
import { CardWithIcon } from "../_molecules/cardWithIcon";
import SliderCard from "../_molecules/sliderCard";
import { Certificate } from "../_atoms/Icons";

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
};

export default page;
