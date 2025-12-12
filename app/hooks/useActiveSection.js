"use client";
import { useEffect, useState } from "react";

export default function useActiveSection(sectionRefs, offset = 150) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const keys = Object.keys(sectionRefs.current || {});
      if (keys.length === 0) return;

      const positions = keys.map((key) => {
        const el = sectionRefs.current[key];
        if (!el) return { key, offset: Infinity };

        const rect = el.getBoundingClientRect();
        return { key, offset: Math.abs(rect.top - offset) };
      });

      const closest = positions.reduce((a, b) => (a.offset < b.offset ? a : b));

      setActiveSection(closest.key);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs, offset]);

  return activeSection;
}
