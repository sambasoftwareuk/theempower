"use client";
import { useState, useEffect, useCallback } from "react";
import { CommentsSection } from "./CommentsSection";

export const CommentsSectionContainer = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState("");


  const fetchComments = useCallback(async () => {
    if (!contentId) return;
    try {
      const res = await fetch(`/api/content/${contentId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setComments([]);
    }
  }, [contentId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (bodyText) => {
    if (!contentId) return;
    setIsSubmitting(true);
    setSuccessMessage("");
    try {
      const res = await fetch(`/api/content/${contentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bodyText }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message || "Yorum gönderildi. Onay bekliyor.");
        fetchComments();
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommentsSection
    comments={comments}
    onSubmit={handleSubmit}
    isSubmitting={isSubmitting}
    successMessage={successMessage}
    title="Comments"
    placeholder="Yorumunuzu yazın..."
    
  />
  );
};