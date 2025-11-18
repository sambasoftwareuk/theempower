"use client";

import { useEffect, useRef, useState } from "react";
import { CardImage } from "../_atoms/images";
import { PrimaryButton } from "../_atoms/buttons";
import { Star } from "../_atoms/Icons";
import Link from "next/link";
import { Header3 } from "../_atoms/Headers";

const CourseCard = ({ course }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!showDetail || !cardRef.current) return;

    const shouldOpenLeft = () => {
      const rect = cardRef.current.getBoundingClientRect();
      const cardWidth = rect.width;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      return spaceRight < cardWidth + 10 && spaceLeft >= cardWidth + 10;
    };

    setOpenLeft(shouldOpenLeft());
  }, [showDetail]);

  return (
    <div
      ref={cardRef}
      className="
        relative
        w-full max-w-[380px]
        bg-white rounded-xl shadow-md border border-gray-200
        flex flex-col hover:shadow-xl transition-shadow duration-200
      "
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      {/* Image */}
      <CardImage imageLink={course?.image} />

      {/* Content */}
      <div className="flex flex-col p-4 flex-grow">
        {/* Üst içerik */}
        <div className="flex flex-col gap-1 min-h-[72px]">
          <Header3 className="text-sm xl:text-md leading-tight  min-h-[38px]">
            {course?.title}
          </Header3>

          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3 min-h-[18px]">
            {course?.author}
          </p>

          {course?.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 flex items-center">
                {[...Array(Math.max(0, Math.round(course?.rating)))].map(
                  (_, i) => (
                    <Star key={i} size={12} fill="#facc15" stroke="none" />
                  )
                )}
              </span>
              <span className="text-muted-foreground text-xs sm:text-sm">
                ({course?.reviews?.toLocaleString()})
              </span>
            </div>
          )}
        </div>

        {/* Alt içerik: price + button */}
        <div className="mt-auto flex flex-col gap-2">
          {course?.price && (
            <div className="flex justify-between items-center">
              <div className="text-sm sm:text-base">
                <span className="font-semibold">
                  €{course?.price?.toFixed(2)}
                </span>
                {course?.oldPrice && (
                  <span className="line-through text-muted-foreground text-xs sm:text-sm ml-2">
                    €{course?.oldPrice?.toFixed(2)}
                  </span>
                )}
              </div>

              {course?.badge && (
                <span className="text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  {course?.badge}
                </span>
              )}
            </div>
          )}

          {course?.link && (
            <Link
              href={course?.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PrimaryButton
                label="Learn More"
                className="w-full bg-primary900 text-white text-xs sm:text-sm whitespace-nowrap mt-2"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Hover Detail (md+) */}
      {showDetail && (
        <div
          className={`
            absolute top-0 ${openLeft ? "right-full" : "left-full"}
            z-50 w-[260px] h-full
            bg-white rounded-md shadow-xl border border-gray-900
            hidden lg:block
          `}
        >
          <div className="p-3 flex flex-col h-full justify-between text-xs sm:text-sm">
            <div>
              <Header3 className="leading-tight mb-1 line-clamp-2">
                {course?.title}
              </Header3>
              <p className="text-muted-foreground mb-1 line-clamp-1">
                {course?.author}
              </p>

              {course?.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 flex items-center">
                    {[...Array(Math.max(0, Math.round(course?.rating)))].map(
                      (_, i) => (
                        <Star key={i} size={12} fill="#facc15" stroke="none" />
                      )
                    )}
                  </span>

                  {course?.reviews && (
                    <span className="text-muted-foreground">
                      ({course?.reviews?.toLocaleString()})
                    </span>
                  )}
                </div>
              )}

              <p className="text-[10px] sm:text-xs mt-2">
                {course?.description || "No description available."}
              </p>
            </div>

            {course?.link ? (
              <Link
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PrimaryButton
                  label="Learn More"
                  className="w-full bg-primary900 text-white text-sm"
                />
              </Link>
            ) : (
              <PrimaryButton
                label="Login"
                className="w-full bg-primary900 text-white text-sm"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
