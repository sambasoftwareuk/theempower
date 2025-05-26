import React from "react";
import { SambaLinks } from "../_atoms/SambaLinks";
import { ProfileImage } from "../_atoms/images";

export const TestimonialCard = ({
  quote,
  authorName,
  authorTitle,
  authorImage,
  sourceLogo,
  courseLink,
  courseTitle,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full max-w-sm m-2">
      <div className="text-lg font-medium text-secondary mb-4">
        <p className="italic">"{quote}"</p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <ProfileImage imageLink="/man.png" />
        <div>
          <p className="font-semibold text-secondary">{authorName}</p>
          <p className="text-sm text-secondary400">{authorTitle}</p>
        </div>
      </div>

      <div className="mt-6">
        <SambaLinks href={courseLink}>{courseTitle} &gt;</SambaLinks>
      </div>
    </div>
  );
};
