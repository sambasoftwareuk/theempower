import { Header3 } from "../_atoms/Headers";
import { LabelTertiary } from "../_atoms/labels.jsx";
import { StarFilled } from "../_atoms/Icons";
import { CardImage } from "../_atoms/images";
import { SambaLinks } from "../_atoms/SambaLinks";

export const CareerCard = ({
  slug,
  title,
  salary,
  roles,
  rating,
  ratingsCount,
  totalHours,
  hero_file_path,
}) => {
  const cardContent = (
    <div className="w-[300px] h-[300px] rounded-xl overflow-hidden shadow-md border p-4 flex flex-col justify-center transition-shadow duration-300 hover:shadow-xl bg-white">
      <CardImage imageLink={hero_file_path} alt="careerCard" />
      <div className="mt-4">
        <Header3 className="text-gray-800 line-clamp-2">{title}</Header3>
        {/* <p className="text-sm text-gray-600 mt-1">
          {salary ? `${salary}` : null} {salary && roles ? " · " : ""}{" "}
          {roles ? `${roles}` : null}
        </p> */}
      </div>
      <div className="flex items-center mt-4 space-x-2">
        {rating ? <LabelTertiary icon={StarFilled}>{rating}</LabelTertiary> : null}
        {ratingsCount ?<LabelTertiary>{ratingsCount}</LabelTertiary> : null}
        {totalHours ? <LabelTertiary> {totalHours}</LabelTertiary> : null}
      </div>
    </div>
  );

  // If id exists, wrap in a link
  if (slug) {
    return (
      <SambaLinks
        href={`/content/${slug}`}
        underline="none"
        className="block"
      >
        {cardContent}
      </SambaLinks>
    );
  }

  // Otherwise, just return the card without link
  return cardContent;
};
