'use client';

import { useState, useRef, useEffect } from "react";
import { Star } from "../_atoms/Icons";
import { PrimaryButton } from "../_atoms/buttons";
import Image from "next/image";

const CourseCard = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (showDetail && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      const cardWidth = rect.width;

      if (spaceRight < cardWidth + 20) {
        setOpenLeft(true);
      } else {
        setOpenLeft(false);
      }
    }
  }, [showDetail]);

  return (
    <div
      ref={cardRef}
      className="relative group w-full max-w-xs aspect-[3/4]"
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 transition-transform duration-200 bg-white">
        <div className="relative w-full h-[45%]">
          <Image
            src="/image1.png"
            alt="course preview"
            fill
            className={`object-cover rounded-t-2xl transition duration-300 ${
              showDetail ? "brightness-75" : ""
            }`}
          />
        </div>

        <div className="p-4 h-[55%] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold leading-tight mb-1">
              ChatGPT 2025: Prompt Mühendisliği, İçerik ve Görs...
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              Dolunay Özeren
            </p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#facc15" stroke="none" />
                ))}
              </span>
              <span className="text-muted-foreground">(1.209)</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div>
              <span className="text-lg font-bold">€11,99</span>{" "}
              <span className="text-sm line-through text-muted-foreground">€64,99</span>
            </div>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
              En çok satan
            </span>
          </div>
        </div>
      </div>

      {showDetail && (
        <div
          className={`
            absolute z-50 bg-white border border-gray-300 rounded-2xl p-4 shadow-xl 
            w-full h-full aspect-[3/4] max-w-xs top-0
            ${openLeft ? "right-full mr-4" : "left-full ml-4"}
          `}
        >
          <h3 className="text-lg font-semibold mb-2">
            ChatGPT 2025: Prompt Mühendisliği, İçerik ve Görsel Üretimi
          </h3>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Toplam 12 saat</span>
            <span>Tüm düzeyler</span>
          </div>
          <p className="text-sm mb-3">
            A’dan Z’ye Yapay Zeka: ChatGPT, Midjourney, DALL-E, Google Gemini,
            Bing AI, Notion ve Dahası ile 10X Yaratıcı Olun!
          </p>
          <ul className="text-sm list-disc list-inside space-y-1 mb-4">
            <li>Yapay Zeka: ML, DL, LLM kavramlarını öğren</li>
            <li>Prompt Mühendisliği: En iyi metinleri oluştur</li>
            <li>ChatGPT: En iyi uygulamalarla kullanmayı öğren</li>
          </ul>
          <PrimaryButton label="Login" className="w-full bg-primary900 text-white" />
        </div>
      )}
    </div>
  );
};

export default CourseCard;
