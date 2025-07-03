import { Header3 } from "../_atoms/Headers";
import { LabelTertiary } from "../_atoms/labels.jsx";
import { StarFilled } from "../_atoms/Icons";
import { CardImage } from "../_atoms/images";

export const CareerCard = ({
  title,
  salary,
  roles,
  rating,
  ratingsCount,
  totalHours,
  image,
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md border p-4">
      <CardImage imageLink={image} alt="careerCard" />
      <div className="mt-4">
        <Header3 className="text-gray-800">{title}</Header3>
        <p className="text-sm text-gray-600 mt-1">
          {salary ? `${salary}` : null} {salary && roles ? " · " : ""} {roles ? `${roles}` : null}
        </p>
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <LabelTertiary icon={StarFilled}>{rating}</LabelTertiary>
        <LabelTertiary>{ratingsCount}</LabelTertiary>
        <LabelTertiary> {totalHours}</LabelTertiary>
      </div>
    </div>
  );
};
