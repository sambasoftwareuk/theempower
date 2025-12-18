"use client";

import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";

export default function HtmlEditor({
  htmlContent,
  setHtmlContent,
  onLoadToEditor,
  onReset,
}) {
  // Format and highlight HTML
  const formatAndHighlightHtml = (html) => {
    return html
      .replace(/></g, ">\n<") // Split tags into lines
      .replace(/^\s+|\s+$/g, "") // Clean whitespace
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      .replace(/(<[^>]+>)/g, '<span class="html-tag">$1</span>'); // Highlight tags
  };

  return (
    <div className="p-3">
      <div className="mb-2 text-sm text-gray-600">
        Edit HTML code. Click the "Load from HTML" button to apply changes.
      </div>

      {/* HTML Preview */}
      <div className="w-full h-64 p-3 border rounded font-mono text-sm bg-gray-50 overflow-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: formatAndHighlightHtml(htmlContent),
          }}
          className="whitespace-pre-wrap"
        />
      </div>

      {/* HTML Textarea */}
      <textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        className="w-full h-32 p-3 border rounded font-mono text-sm mt-2"
        placeholder="Enter HTML code here..."
      />

      {/* Action Buttons */}
      <div className="mt-2 flex gap-2">
        <PrimaryButton
          label="Load from HTML"
          onClick={onLoadToEditor}
          className="bg-green-600 hover:bg-green-700"
        />
        <OutlinedButton
          label="Reset"
          onClick={onReset}
          className="bg-primary900 text-primary900 hover:bg-primary800"
        />
      </div>
    </div>
  );
}
