"use client";
import { SignedIn } from "@clerk/nextjs";
import { Header3 } from "../_atoms/Headers";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import Link from "next/link";
import { useI18n } from "@/locales/client";

export const CommentsSection = ({
  comments = [],
  onSubmit,
  isSubmitting = false,
  title,
  placeholder,
  successMessage = "",
}) => {
  const t = useI18n();
  const sectionTitle = title ?? t("comments");
  const inputPlaceholder = placeholder ?? t("writeCommentPlaceholder");
  return (
    <section className="w-full py-8 border-t border-gray-200">
      <div className="max-w-3xl">
        <Header3 className="mb-6">{sectionTitle}</Header3>

        <SignedIn>
          <div className="mb-8">
            <CommentForm
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              placeholder={inputPlaceholder}
            />
          </div>
        </SignedIn>
        {successMessage && (
          <p className="mb-6 text-green-600 font-medium">{successMessage}</p>
        )}

        <div className="space-y-0">
          {comments.length === 0 ? (
            <div className="text-gray-500 py-4 flex flex-wrap items-center gap-2">
              <span>{t("noCommentsYet")}</span>
              <Link
                href="/sign-up"
                className="inline-block py-2 px-4 rounded text-white bg-primary900 border border-primary900 hover:bg-primary transition-all text-sm whitespace-nowrap"
              >
                {t("signUp")}
              </Link>
            </div>
          ) : (
            comments.map((comment, index) => (
              <CommentItem
                key={index}
                displayName={comment.displayName}
                avatarUrl={comment.avatarUrl}
                createdAt={comment.createdAt}
                bodyText={comment.bodyText}
                status={comment.status}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
