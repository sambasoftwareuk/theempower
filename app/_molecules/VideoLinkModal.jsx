"use client";

import { useState } from "react";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import { Header2 } from "../_atoms/Headers";
import { InputBasic } from "../_atoms/inputs";
import Icon from "../_atoms/Icon";

export default function VideoLinkModal({ isOpen, onClose, onInsert }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!videoUrl.trim()) {
      setError("Please enter a video link");
      return;
    }

    let embedUrl = videoUrl.trim();

    // If iframe HTML is pasted, extract src
    if (embedUrl.includes("<iframe")) {
      const temp = document.createElement("div");
      temp.innerHTML = embedUrl;
      const iframe = temp.querySelector("iframe");
      if (iframe && iframe.src) {
        embedUrl = iframe.src;
      } else {
        // Extract src using regex
        const srcMatch = embedUrl.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
          embedUrl = srcMatch[1];
        } else {
          setError("Could not extract video link from iframe HTML");
          return;
        }
      }
    }

    // Fix incorrect slashes in URL (https:/ -> https://)
    embedUrl = embedUrl.replace(/https?:\/(?!\/)/g, (match) => match + "/");

    // Convert YouTube watch URL to embed
    if (embedUrl.includes("youtube.com/watch")) {
      const videoId = embedUrl.split("v=")[1]?.split("&")[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (embedUrl.includes("youtu.be/")) {
      const videoId = embedUrl.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Validate embed URL
    if (!embedUrl.startsWith("http://") && !embedUrl.startsWith("https://")) {
      setError("Please enter a valid video link");
      return;
    }

    // Validate YouTube embed URL
    if (embedUrl.includes("youtube.com") && !embedUrl.includes("/embed/")) {
      setError(
        "YouTube link must be in embed format (e.g., https://www.youtube.com/embed/VIDEO_ID)"
      );
      return;
    }

    onInsert(embedUrl);
    setVideoUrl("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setVideoUrl("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Header2 className="text-lg font-semibold">Add Video Link</Header2>
          <OutlinedButton
            icon={<Icon variant="LineXIcon" />}
            onClick={handleClose}
            className="text-sm px-3 py-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Embed Link
          </label>
          <InputBasic
            type="text"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setError("");
            }}
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
            className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-gray-500">
            Example: https://www.youtube.com/watch?v=VIDEO_ID or
            https://www.youtube.com/embed/VIDEO_ID
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <OutlinedButton label="Cancel" onClick={handleClose} />
          <PrimaryButton
            label="Add"
            onClick={handleSubmit}
            className="bg-blue-600 text-white"
          />
        </div>
      </div>
    </div>
  );
}
