"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { usePageEdit } from "../context/PageEditProvider";
import ImageEditor from "./ImageEditor";
import { SignedIn } from "@clerk/nextjs";

export default function DraftHeroImage({
  initialUrl = "/generic-image.png",
  initialAlt = "Hero",
  width = 320,
  height = 320,
  className = "rounded-lg object-cover w-80 h-80",
}) {
  const { heroUrl, heroAlt, heroMediaId } = usePageEdit();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Context'ten gelen değerleri kullan, yoksa initial değerleri kullan (memoized)
  // Hydration hatasını önlemek için client-side'da context değerlerini kullan
  const { url, alt, id } = useMemo(
    () => ({
      url: isClient && heroUrl ? heroUrl : initialUrl,
      alt: isClient && heroAlt ? heroAlt : initialAlt,
      id: isClient ? heroMediaId : null,
    }),
    [heroUrl, heroAlt, heroMediaId, initialUrl, initialAlt, isClient]
  );

  return (
    <div className="w-full md:w-80 shrink-0 relative">
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={className}
        dataImageId={id}
      />
      <SignedIn>
        <div className="absolute top-2 right-2">
          <ImageEditor initialUrl={initialUrl} initialAlt={initialAlt} />
        </div>
      </SignedIn>
    </div>
  );
}
