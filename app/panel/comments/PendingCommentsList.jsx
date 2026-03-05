"use client";
import { BaseButton } from "@/app/_atoms/buttons";
import { Header3 } from "@/app/_atoms/Headers";
import { useEffect, useState } from "react";

export function PendingCommentsList() {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetch("/api/admin/comments/pending", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          setComments([]);
          return;
        }
        return res.json();
      })
      .then((data) => setComments(data.comments || []));
  }, []);

  const handleApprove = (commentId) => {
    fetch("/api/admin/comments/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ commentId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server error");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUnapprove = (commentId) => {
    fetch("/api/admin/comments/unapprove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ commentId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
      })
      .catch((err) => console.error(err));
  };

  const pendingComments = comments.filter((c) => c.status === "pending");
  const approvedComments = comments.filter((c) => c.status === "approved");

  return (
    <div>
      <Header3>Pending comments</Header3>
      <ol>
        {pendingComments.map((comment, index) => (
          <li key={comment.id} className="flex items-center gap-4 mb-4">
            <span className="font-bold">{index + 1}.</span>
            {comment.bodyText} - {comment.contentTitle}- {comment.displayName}
            <BaseButton
              type="button"
              className="bg-primary900 text-white hover:bg-primary shadow-lg rounded-2xl"
              onClick={() => {
                handleApprove(comment.id);
              }}
            >
              Approve
            </BaseButton>
          </li>
        ))}
      </ol>
      <Header3 className="mt-8">Approved comments</Header3>
      <ol>
        {approvedComments.map((comment, index) => (
          <li key={comment.id} className="flex items-center gap-4 mb-4">
            <span className="font-bold">{index + 1}.</span>
            {comment.bodyText} - {comment.contentTitle} - {comment.displayName}
            <BaseButton
              type="button"
              className="bg-primary900 text-white hover:bg-primary shadow-lg rounded-2xl"
              onClick={() => handleUnapprove(comment.id)}
            >
              Unapprove
            </BaseButton>
          </li>
        ))}
      </ol>
    </div>
  );
}
