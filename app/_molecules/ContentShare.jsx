"use client";
import { useEffect, useState } from "react";
import { PrimaryButton, XButton } from "../_atoms/buttons";
import Icon from "../_atoms/Icon";
import {
  Facebook,
  LineXIcon,
  Share,
  Twitter,
  WhatsApp,
  LinkIcon,
} from "../_atoms/Icons";
import { toast } from "sonner";

export const ContentShare = ({ title }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    shareUrl,
  )}&text=${encodeURIComponent(title || "")}`;

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl,
  )}`;

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    (title || "") + " " + shareUrl,
  )}`;
  const shareLinks = [
    { href: twitterHref, Icon: Twitter, name: "Twitter", color: "#000000" },
    { href: facebookHref, Icon: Facebook, name: "Facebook", color: "#1877F2" },
    { href: whatsappHref, Icon: WhatsApp, name: "WhatsApp", color: "#25D366" },
  ];
  return (
    <div className="relative inline-block">
      <PrimaryButton
        label="Share"
        onClick={() => setOpen((prev) => !prev)}
        className="bg-primary900 border-none"
        icon={<Icon variant={Share} size={24} />}
      />
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute left-full top-0 z-50 ml-6 w-48 max-w-[200px] rounded-lg bg-white p-2 shadow-xl border border-primary900 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Share options"
          >
            <div className="absolute -right-2 -top-2">
              <XButton
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-lg size-6"
                aria-label="Close"
              >
                <LineXIcon />
              </XButton>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {shareLinks.map(({ href, Icon: PlatformIcon, name, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  style={color ? { color } : undefined}
                >
                  <Icon variant={PlatformIcon} size={22} />
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied!");
                }}
                className="inline-flex items-center justify-center p-0.5 rounded hover:text-ruby transition-colors"
                title="Copy link"
                aria-label="Copy link"
              >
                <Icon variant={LinkIcon} size={22} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
