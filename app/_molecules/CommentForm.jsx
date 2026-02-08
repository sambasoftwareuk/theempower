"use client";
import { useState } from "react";
import { TextAreaBasic } from "../_atoms/inputs";
import { PrimaryButton } from "../_atoms/buttons";

export const CommentForm = ({
  onSubmit,
  isSubmitting = false,
  placeholder = "Write your comment...",
}) => {
  const [bodyText, setBodyText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = bodyText.trim();
    if (!trimmed || isSubmitting) return;
    onSubmit(trimmed);
    setBodyText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextAreaBasic
        value={bodyText}
        onChange={(e) => setBodyText(e.target.value)}
        placeholder={placeholder}
        rows={4}
        disabled={isSubmitting}
      />
      <PrimaryButton
        type="submit"
        label={isSubmitting ? "Sending..." : "Post Comment"}
        disabled={isSubmitting}
      />
    </form>
  );
};
