"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { isAdmin } from "@/lib/roleUtils";
import { CommentsSection } from "./CommentsSection";
import { BaseButton } from "../_atoms/buttons";
import { Header3 } from "../_atoms/Headers";

export const CommentsSectionContainer = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { user } = useUser();
  const empowerMembership = user?.organizationMemberships?.find(
    (m) =>
      m.organization?.name === "theempower" ||
      m.organization?.slug?.startsWith("theempower")
  );
  const role = empowerMembership?.role ?? null;
  const isAdminUser = isAdmin(role);

  const fetchComments = useCallback(async () => {
    if (!contentId) return;
    try {
      const res = await fetch(`/api/content/${contentId}/comments`, {
        credentials: "include",
      });
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setComments([]);
    }
  }, [contentId]);

  const fetchPendingComments = useCallback(async () => {
    if (!contentId || !isAdminUser) return;
    try {
      const res = await fetch(
        `/api/admin/comments/pending-by-content?content_id=${contentId}`,
        { credentials: "include" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setPendingComments(data.comments || []);
    } catch {
      setPendingComments([]);
    }
  }, [contentId, isAdminUser]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    fetchPendingComments();
  }, [fetchPendingComments]);

  const handleApprovePending = async (commentId) => {
    try {
      const res = await fetch("/api/admin/comments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        let message = "Could not approve comment.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          /* ignore */
        }
        toast.error(message);
        return;
      }

      setPendingComments((prev) => prev.filter((c) => c.id !== commentId));
      fetchComments();
      toast.success("Comment approved.");
    } catch {
      toast.error("Could not approve comment.");
    }
  };

  const handleRejectPending = async (commentId) => {
    try {
      const res = await fetch("/api/admin/comments/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        let message = "Could not reject comment.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          /* ignore */
        }
        toast.error(message);
        return;
      }

      setPendingComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment rejected.");
    } catch {
      toast.error("Could not reject comment.");
    }
  };

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
        setSuccessMessage(data.message || "Comment submitted. Awaiting approval.");
        fetchComments();
        fetchPendingComments();
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isAdminUser && pendingComments.length > 0 && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <Header3 className="mb-4 text-gray-800">Pending comments</Header3>
          <ul className="space-y-3">
            {pendingComments.map((comment) => (
              <li
                key={comment.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800">{comment.bodyText}</p>
                  <span className="text-sm text-gray-500">
                    {comment.displayName} · {comment.createdAt}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <BaseButton
                    type="button"
                    className="bg-primary900 text-white hover:bg-primary shadow rounded-lg px-4 py-2"
                    onClick={() => handleApprovePending(comment.id)}
                  >
                    Approve
                  </BaseButton>
                  <BaseButton
                    type="button"
                    className="border border-gray-400 text-gray-800 bg-white hover:bg-gray-100 shadow rounded-lg px-4 py-2"
                    onClick={() => handleRejectPending(comment.id)}
                  >
                    Reject
                  </BaseButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <CommentsSection
        comments={comments}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        successMessage={successMessage}
        title="Comments"
        placeholder="Write your comment..."
      />
    </>
  );
};