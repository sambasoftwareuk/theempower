"use client";
import { SignedIn } from "@clerk/nextjs";
import { Header3 } from "../_atoms/Headers";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

export const CommentsSection = ({
  comments = [],
  onSubmit,
  isSubmitting = false,
  title = "Comments",
  placeholder = "Yorumunuzu yazın...",
  successMessage = "",
}) => {
  return (
    <section className="w-full py-8 border-t border-gray-200">
      <div className="max-w-3xl">
        <Header3 className="mb-6">{title}</Header3>

        <SignedIn>
          <div className="mb-8">
            <CommentForm
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              placeholder={placeholder}
            />
          </div>
        </SignedIn>
        {successMessage && (
          <p className="mb-6 text-green-600 font-medium">{successMessage}</p>
        )}

        <div className="space-y-0">
          {comments.length === 0 ? (
            <p className="text-gray-500 py-4">
              Henüz onaylanmış yorum yok. İlk yorumu siz yapın!
            </p>
          ) : (
            comments.map((comment, index) => (
              <CommentItem
                key={index}
                displayName={comment.displayName}
                avatarUrl={comment.avatarUrl}
                createdAt={comment.createdAt}
                bodyText={comment.bodyText}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
