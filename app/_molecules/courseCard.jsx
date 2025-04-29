"use client";

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
      const spaceLeft = rect.left;
      const cardWidth = rect.width;

      if (spaceRight < cardWidth + 10 && spaceLeft >= cardWidth + 10) {
        setOpenLeft(true);
      } else {
        setOpenLeft(false);
      }
    }
  }, [showDetail]);

  return (
    <div
      ref={cardRef}
      className="relative group w-full max-w-[250px] aspect-[3/4]"
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
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

        <div className="p-3 h-[55%] flex flex-col justify-between text-xs sm:text-sm">
          <div>
            <h3 className="font-semibold leading-tight mb-1">
              ChatGPT 2025: Prompt Mühendisliği, İçerik ve Görs...
            </h3>
            <p className="text-muted-foreground mb-1">Dolunay Özeren</p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#facc15" stroke="none" />
                ))}
              </span>
              <span className="text-muted-foreground">(1.209)</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="font-bold">€11,99</span>{" "}
              <span className="line-through text-muted-foreground text-xs">
                €64,99
              </span>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              En çok satan
            </span>
          </div>
        </div>
      </div>

      {showDetail && (
        <div
          className={`
            absolute top-0 ${openLeft ? "right-full" : "left-full"} 
            z-50 w-full h-full max-w-[250px] aspect-[3/4]
            bg-white rounded-2xl shadow-xl border border-gray-200
          `}
        >
          <div className="p-3 flex flex-col h-full justify-between text-xs sm:text-sm ">
            <div>
              <h3 className="font-semibold leading-tight mb-1">
                ChatGPT 2025: Prompt Mühendisliği, İçerik ve Görsel Üretimi
              </h3>
              <p className="text-muted-foreground mb-1">Dolunay Özeren</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#facc15" stroke="none" />
                  ))}
                </span>
                <span className="text-muted-foreground">(1.209)</span>
              </div>
              <p className="text-[10px] sm:text-xs mt-2">
                A’dan Z’ye Yapay Zeka: ChatGPT, Midjourney, DALL-E, Google
                Gemini, Bing AI, Notion ve Dahası ile 10X Yaratıcı Olun!
              </p>
            </div>

            <div>
              <PrimaryButton
                label="Login"
                className="w-full bg-primary900 text-white text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
