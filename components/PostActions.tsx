"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/config";
import { deletePost, updatePost } from "@/lib/posts-client";

export default function PostActions({
  id,
  title,
  body,
}: {
  id: string;
  title: string;
  body: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [titleText, setTitleText] = useState(title);
  const [bodyText, setBodyText] = useState(body);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!titleText.trim()) {
      setError("A post needs a title.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await updatePost(id, titleText.trim(), bodyText.trim());
      setEditing(false);
      router.refresh();
    } catch {
      setError("Could not save your changes. Try again.");
    }
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    try {
      await deletePost(id);
      router.refresh();
    } catch {
      setError("Could not delete the post. Try again.");
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="w-full">
        <input
          value={titleText}
          maxLength={SITE.maxTitleLength}
          onChange={(e) => setTitleText(e.target.value)}
          aria-label="Edit title"
          className="w-full rounded-lg border border-[var(--line)] p-3 text-lg font-semibold"
        />
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={5}
          aria-label="Edit your post"
          className="mt-2 w-full rounded-lg border border-[var(--line)] p-3 leading-relaxed"
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-2 flex gap-2">
          <button
            onClick={save}
            disabled={busy}
            className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-sm font-medium text-[var(--brand-ink)] disabled:opacity-40"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setTitleText(title);
              setBodyText(body);
              setError("");
            }}
            className="rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setEditing(true)}
        className="rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-medium"
      >
        Edit
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-medium text-red-700 disabled:opacity-40"
      >
        Delete
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </>
  );
}
