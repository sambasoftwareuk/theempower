import Image from "next/image";
import { Header1, Header2, Header3 } from "../_atoms/Headers";
import {
  LabelPrimary,
  LabelSecondary,
  LabelTertiary,
} from "../_atoms/labels.jsx";
import {
  Cart,
  Search,
  Globe,
  Star,
  HalfStar,
  PremiumBadge,
} from "../_atoms/Icons";
import { careers } from "../constants/careers";
import Icon from "../_atoms/Icon";

export const CareerCard = ({
  title,
  image,
  salary,
  roles,
  rating,
  ratingsCount,
  totalHours,
}) => {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-md bg-white border p-4">
      <div className="relative h-40 w-full rounded-md overflow-hidden">
        <Image
          src="/image1.png"
          alt="career path"
          fill
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      <div className="mt-4">
        <Header3 className="text-gray-800 ">{title}</Header3>
        <p className="text-sm text-gray-600 mt-1">
          {salary} · {roles}
        </p>
      </div>
      <div className="flex items-center mt-4 space-x-4">
        <LabelTertiary icon={Star} className="text-red">
          {rating}
        </LabelTertiary>
        <LabelTertiary className="text-primary">{ratingsCount}</LabelTertiary>
        <LabelTertiary> {totalHours}</LabelTertiary>

        {/* <div className="flex items-center  gap-2 border border-1 rounded-md p-0.5">
          <Icon variant={Star} size={20} color="text-amber-500 " />
          <span>{rating}</span>
        </div>

        <span className="text-gray-600  border border-1 rounded-md p-1">
          {ratingsCount}
        </span>
        <span className="text-gray-600 border border-1 rounded-md p-1">
          {totalHours}
        </span> */}
      </div>
    </div>
  );
};
