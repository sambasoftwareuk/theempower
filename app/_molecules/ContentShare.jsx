"use client";
import { useEffect, useState } from "react";
import { BaseButton, PrimaryButton, XButton } from "../_atoms/buttons";
import { toast } from "sonner";
import Icon from "../_atoms/Icon";
import { Facebook, LineXIcon, Share, Twitter, WhatsApp } from "../_atoms/Icons";

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
    <div>
      <PrimaryButton
        label="Share"
        onClick={() => setOpen((prev) => !prev)}
        className="bg-primary900 border-none hover:text-primary900 hover:bg-white"
        icon={<Icon variant={Share} size={24} />}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Share options"
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end mb-4">
              <XButton
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded"
                aria-label="Close"
              >
                <LineXIcon  />
              </XButton>
            </div>
            <div className="flex flex-wrap items-center gap-4">
            {shareLinks.map(({ href, Icon: PlatformIcon, name, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  style={color ? { color } : undefined}
                >
                  <Icon variant={PlatformIcon} size={24} />
                </a>
              ))}
              <BaseButton
                className="hover:text-ruby"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied!");
                }}
              >
                Copy link
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
