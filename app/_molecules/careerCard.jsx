import { Header3 } from "../_atoms/Headers";
import { LabelTertiary } from "../_atoms/labels.jsx";
import { StarFilled } from "../_atoms/Icons";
import { CardImage } from "../_atoms/images";
import { SambaLinks } from "../_atoms/SambaLinks";

export const CareerCard = ({
  id,
  title,
  salary,
  roles,
  rating,
  ratingsCount,
  totalHours,
  image,
}) => {
  const cardContent = (
    <div className="rounded-xl overflow-hidden shadow-md border p-4 transition-shadow duration-300 hover:shadow-xl">
      <CardImage imageLink={image} alt="careerCard" />
      <div className="mt-4">
        <Header3 className="text-gray-800">{title}</Header3>
        <p className="text-sm text-gray-600 mt-1">
          {salary ? `${salary}` : null} {salary && roles ? " · " : ""}{" "}
          {roles ? `${roles}` : null}
        </p>
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <LabelTertiary icon={StarFilled}>{rating}</LabelTertiary>
        <LabelTertiary>{ratingsCount}</LabelTertiary>
        <LabelTertiary> {totalHours}</LabelTertiary>
      </div>
    </div>
  );

  // If id exists, wrap in a link
  if (id) {
    return (
      <SambaLinks
        href={`/course-details/${id}`}
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
