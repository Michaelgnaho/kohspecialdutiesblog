import { Author } from "@/lib/types";

export default function Avatar({ author }: { author: Author }) {
  const initials = author.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return author.avatarUrl ? (
    <img src={author.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
  ) : (
    <div aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-semibold text-[var(--brand-ink)]">
      {initials}
    </div>
  );
}
