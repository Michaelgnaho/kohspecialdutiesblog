"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/config";
import { createPost } from "@/lib/posts-client";
import { uploadImage } from "@/lib/storage";

export default function Composer() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files],
  );
  const canPost = title.trim().length > 0 && !busy;

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles([...files, ...Array.from(list)].slice(0, SITE.maxImagesPerPost));
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const imagePaths = await Promise.all(files.map(uploadImage));
      await createPost({ title: title.trim(), body: body.trim(), imagePaths });
      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Your post didn't go through. Check your connection and try again.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <label htmlFor="title" className="sr-only">
        Title
      </label>
      <input
        id="title"
        value={title}
        maxLength={SITE.maxTitleLength}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border-b border-[var(--line)] bg-transparent pb-3 font-[family-name:var(--font-head)] text-2xl font-semibold outline-none placeholder:text-[var(--muted)]"
      />
      <label htmlFor="body" className="sr-only">
        Write your update
      </label>
      <textarea
        id="body"
        value={body}
        maxLength={SITE.maxPostLength}
        rows={6}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What happened today?"
        className="mt-3 w-full resize-none bg-transparent text-base leading-relaxed outline-none"
      />
      {previews.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <li
              key={src}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setFiles(files.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 h-7 w-7 rounded-full bg-black/60 text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium"
          >
            Add photos ({files.length}/{SITE.maxImagesPerPost})
          </button>
        </div>
        <button
          type="button"
          disabled={!canPost}
          onClick={submit}
          className="rounded-full bg-[var(--brand)] px-5 py-2 font-medium text-[var(--brand-ink)] disabled:opacity-40"
        >
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Your post goes live right away.
      </p>
    </div>
  );
}
