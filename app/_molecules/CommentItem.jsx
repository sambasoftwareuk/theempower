"use client";
import { ProfileImage } from "../_atoms/images";

export const CommentItem = ({
  displayName = "Anonymous",
  avatarUrl = "",
  createdAt = "",
  bodyText = "",
}) => {
  const imageSrc = avatarUrl && avatarUrl.trim() !== "" ? avatarUrl : "/generic-profile.png";

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-shrink-0">
        <ProfileImage imageLink={imageSrc} imageAlt={displayName} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <span className="font-semibold text-gray-900">{displayName}</span>
          {createdAt && (
            <span className="text-sm text-gray-500">{createdAt}</span>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed">{bodyText}</p>
      </div>
    </div>
  );
};