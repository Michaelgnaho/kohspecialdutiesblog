"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
] as const;

export default function SearchBar({
  autoFocus = false,
}: {
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const urlQ = params.get("q") ?? "";
  const urlSort = params.get("sort") ?? "newest";
  const sort = SORTS.some((s) => s.value === urlSort) ? urlSort : "newest";

  const [q, setQ] = useState(urlQ);
  const [pushed, setPushed] = useState(urlQ);
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);

  // If the URL changes from outside (e.g. the logo link), reflect it in the box,
  // but ignore the change when it is just our own debounced update coming back.
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    if (urlQ !== pushed) setQ(urlQ);
  }

  function go(nextQ: string, nextSort: string) {
    const sp = new URLSearchParams();
    if (nextQ.trim()) sp.set("q", nextQ.trim());
    if (nextSort !== "newest") sp.set("sort", nextSort);
    const qs = sp.toString();
    router.replace(qs ? `/?${qs}` : "/");
  }

  // Search as you type (debounced)
  useEffect(() => {
    if (q.trim() === urlQ.trim()) return;
    const t = setTimeout(() => {
      setPushed(q.trim());
      const sp = new URLSearchParams();
      if (q.trim()) sp.set("q", q.trim());
      if (sort !== "newest") sp.set("sort", sort);
      const qs = sp.toString();
      router.replace(qs ? `/?${qs}` : "/");
    }, 350);
    return () => clearTimeout(t);
  }, [q, urlQ, sort, router]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        setPushed(q.trim());
        go(q, sort);
        inputRef.current?.blur();
      }}
      className="flex w-full items-center gap-2"
    >
      <div className="relative min-w-0 flex-1">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts"
          aria-label="Search posts"
          maxLength={100}
          className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] py-2.5 pl-9 pr-9 text-base outline-none focus:border-[var(--brand)] md:py-2 md:text-sm [&::-webkit-search-cancel-button]:appearance-none"
        />
        {q && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQ("");
              setPushed("");
              go("", sort);
              inputRef.current?.focus();
            }}
            className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ×
          </button>
        )}
      </div>
      <label className="sr-only" htmlFor="sort">
        Sort posts
      </label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => {
          setPushed(q.trim());
          go(q, e.target.value);
        }}
        className="shrink-0 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-base outline-none focus:border-[var(--brand)] md:py-2 md:text-sm"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </form>
  );
}
