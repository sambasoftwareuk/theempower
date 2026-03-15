"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/locales/client";
import { BaseButton, PrimaryButton } from "../_atoms/buttons";
import { toast } from "sonner";
import Icon from "../_atoms/Icon";
import { Facebook, Share, Twitter, WhatsApp } from "../_atoms/Icons";

export const ContentShare = ({ title }) => {
  const t = useI18n();
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
    { href: twitterHref, Icon: Twitter, name: "Twitter" },
    { href: facebookHref, Icon: Facebook, name: "Facebook" },
    { href: whatsappHref, Icon: WhatsApp, name: "WhatsApp" },
  ];
  return (
    <div>
      <PrimaryButton
        label={t("share")}
        onClick={() => setOpen((prev) => !prev)}
        className="bg-white text-primary500 border-none hover:text-white hover:bg-primary900"
        icon={<Icon variant={Share} size={24} />}
      />
      {open && (
        <div className="flex items-center gap-4 mt-4">
          {shareLinks.map(({ href, Icon: PlatformIcon, name }) => (
            <a key={name} href={href} target="_blank" rel="noopener">
              <Icon variant={PlatformIcon} size={24} />
            </a>
          ))}
          <BaseButton
            className="hover:text-ruby mr-2"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied!");
            }}
          >
            Copy link
          </BaseButton>
        </div>
      )}
    </div>
  );
};
