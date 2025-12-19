"use client";

import { useState, useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import XButton from "../_atoms/XButton";
import { ResizeHandleIcon } from "../_atoms/Icons";

export default function CustomImageComponent(props) {
  const {
    src,
    alt,
    width,
    type = "image",
    aspectRatio,
    textAlign,
  } = props.node.attrs;
  const containerRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startWidth, setStartWidth] = useState(0);
  const [startX, setStartX] = useState(0);
  const [activeCorner, setActiveCorner] = useState(null);
  const [startLeft, setStartLeft] = useState(0);

  // Calculate aspect ratio (on first render)
  const [calculatedAspectRatio, setCalculatedAspectRatio] =
    useState(aspectRatio);

  useEffect(() => {
    if (type === "iframe") {
      setCalculatedAspectRatio(16 / 9); // YouTube default
    } else if (containerRef.current && !aspectRatio) {
      const img = containerRef.current.querySelector("img");
      if (img) {
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          setCalculatedAspectRatio(ratio);
          props.updateAttributes({ aspectRatio: ratio });
        };
      }
    }
  }, [type, src]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const corner = e.currentTarget.dataset.corner;
    setActiveCorner(corner);
    setIsResizing(true);
    setStartX(e.clientX);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStartWidth(rect.width);
      setStartLeft(rect.left);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.deleteNode();
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (containerRef.current && containerRef.current.parentElement) {
        const parentWidth =
          containerRef.current.parentElement.getBoundingClientRect().width;
        const maxWidth = parentWidth;
        const minWidth = 100; // Minimum 100px

        let deltaX = e.clientX - startX;
        let newWidth;
        let newLeft;

        // Reverse logic for left corners
        if (activeCorner === "bottom-left" || activeCorner === "top-left") {
          // When moving left, width decreases, left position shifts left
          newWidth = startWidth - deltaX;
          newLeft = startLeft + deltaX;

          // Check boundaries
          newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

          // Calculate percentage relative to parent
          const percentage = (newWidth / parentWidth) * 100;

          // Calculate marginLeft relative to parent
          const parentLeft =
            containerRef.current.parentElement.getBoundingClientRect().left;
          const marginLeftPx = newLeft - parentLeft;
          const marginLeftPercent = (marginLeftPx / parentWidth) * 100;

          props.updateAttributes({
            width: `${percentage}%`,
            marginLeft: `${marginLeftPercent}%`,
          });
        } else {
          // Existing logic for right corners
          newWidth = startWidth + deltaX;
          newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
          const percentage = (newWidth / parentWidth) * 100;
          props.updateAttributes({ width: `${percentage}%` });
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setActiveCorner(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth, startLeft, activeCorner, props]);

  return (
    <NodeViewWrapper className="custom-image-wrapper" contentEditable={false}>
      <div
        ref={containerRef}
        className={`relative block rounded ${
          props.selected ? "ring-2 ring-primary" : ""
        }`}
        style={{
          width,
          marginLeft:
            textAlign === "right"
              ? "auto"
              : textAlign === "center"
              ? "auto"
              : "0",
          marginRight:
            textAlign === "left"
              ? "auto"
              : textAlign === "center"
              ? "auto"
              : "0",
          display: "block",
          cursor: type === "iframe" ? "default" : "auto",
        }}
      >
        {type === "iframe" ? (
          <iframe
            src={src}
            className="max-w-full rounded"
            style={{
              width: "100%",
              aspectRatio: calculatedAspectRatio
                ? `${calculatedAspectRatio}`
                : "16/9",
              border: "none",
              cursor: "default",
              pointerEvents: isResizing ? "none" : "auto",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded"
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: calculatedAspectRatio
                ? `${calculatedAspectRatio}`
                : "auto",
            }}
          />
        )}

        {/* Resize handle - top right corner, arrow points in resize direction (right-down) */}
        {props.selected && (
          <XButton
            onClick={handleDelete}
            className="absolute -top-1 -left-1 w-6 h-6 z-10"
            title="Delete"
              />
        )}

        {/* Resize handles - 4 corners */}
        {props.selected && (
          <>
            {/* Top right corner */}
            <div
              ref={resizeHandleRef}
              onMouseDown={handleMouseDown}
              data-corner="top-right"
              className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded shadow-lg z-10 flex items-center justify-center"
              style={{ cursor: "nesw-resize" }}
            >
              <ResizeHandleIcon />
            </div>
            {/* Bottom right corner */}
            <div
              onMouseDown={handleMouseDown}
              data-corner="bottom-right"
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded shadow-lg z-10 flex items-center justify-center"
              style={{ cursor: "nwse-resize" }}
            >
              <ResizeHandleIcon rotate={270} />
            </div>

            {/* Bottom left corner */}
            <div
              onMouseDown={handleMouseDown}
              data-corner="bottom-left"
              className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary border-2 border-white rounded shadow-lg z-10 flex items-center justify-center"
              style={{ cursor: "nesw-resize" }}
            >
              <ResizeHandleIcon />
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
