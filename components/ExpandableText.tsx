"use client";
import { useState } from "react";

const WORD_LIMIT = 100;

// Returns the text up to the 100th word, or null if the text is not longer than that.
function preview(text: string, limit: number): string | null {
  const re = /\S+/g;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    count++;
    if (count === limit) {
      const end = m.index + m[0].length;
      return text.slice(end).trim() ? text.slice(0, end) : null;
    }
  }
  return null;
}

export default function ExpandableText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const short = preview(text, WORD_LIMIT);

  if (!short) {
    return <p className="mt-2 whitespace-pre-line leading-relaxed">{text}</p>;
  }

  return (
    <div className="mt-2">
      <p className="whitespace-pre-line leading-relaxed">
        {open ? text : `${short}…`}
      </p>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-1 text-sm font-medium text-[var(--brand)]"
      >
        {open ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
