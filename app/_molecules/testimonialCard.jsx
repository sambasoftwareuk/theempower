import { SambaLinks } from "../_atoms/SambaLinks";
import { ProfileImage } from "../_atoms/images";
import { ChevronRight } from "../_atoms/Icons";

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
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <div className="text-xs font-medium text-secondary mb-4 max-h-32 overflow-y-auto items-center">
        <p className="italic">"{quote}"</p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <div className="w-[60px] h-[60px]">
          <ProfileImage imageLink={authorImage} />
        </div>
        <div>
          <p className="font-semibold text-sm text-secondary">{authorName}</p>
          <p className="text-xs text-secondary400">{authorTitle}</p>
        </div>
      </div>

      <div className="mt-6 text-primary">
        {courseTitle && (
          <SambaLinks href={courseLink} className="flex">
            {courseTitle} <ChevronRight />
          </SambaLinks>
        )}
      </div>
    </div>
  );
};
