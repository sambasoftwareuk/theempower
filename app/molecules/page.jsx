"use client";
import CourseCard from "../_molecules/courseCard";
import SliderCard from "../_molecules/sliderCard";

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
    </div>
  );
};

export default page;
