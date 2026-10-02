"use client";
import { useRouter } from "next/navigation";
import { setPostStatus } from "@/lib/posts-client";
export default function ReviewActions({ id }: { id: string }) {
  const router = useRouter();
  async function act(status: "published" | "draft") {
    await setPostStatus(id, status);
    router.refresh();
  }
  return (
    <>
      <button
        onClick={() => act("published")}
        className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-sm font-medium text-[var(--brand-ink)]"
      >
        Publish
      </button>
      <button
        onClick={() => act("draft")}
        className="rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-medium"
      >
        Send back
      </button>
    </>
  );
}
