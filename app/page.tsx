import Link from "next/link";
import PostCard from "@/components/PostCard";
import PostActions from "@/components/PostActions";
import { getPublishedPosts, type PostSort } from "@/lib/posts";
import { createClient } from "@/lib/supabase-server";

type SearchParams = Promise<{
  q?: string | string[];
  sort?: string | string[];
}>;

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const sortParam = first(sp.sort);
  const sort: PostSort =
    sortParam === "oldest" || sortParam === "title" ? sortParam : "newest";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: me } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = me?.role === "admin";
  }

  const posts = await getPublishedPosts(0, 20, { q, sort });

  return (
    <div className="space-y-4">
      {q && (
        <p className="inline-block rounded-full bg-[var(--surface)]/95 px-4 py-1.5 text-sm text-[var(--muted)] shadow-sm">
          {posts.length} {posts.length === 1 ? "result" : "results"} for{" "}
          <span className="font-medium text-[var(--ink)]">“{q}”</span>
        </p>
      )}
      {posts.length === 0 && q ? (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)]/95 px-4 py-12 text-center">
          <h1 className="text-xl font-semibold">No posts found</h1>
          <p className="mt-2 text-[var(--muted)]">
            Try a different word, or{" "}
            <Link href="/" className="font-medium text-[var(--brand)]">
              clear the search
            </Link>
            .
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)]/95 px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">No updates yet</h1>
          <p className="mt-2 text-[var(--muted)]">
            Share the first update from the field.
          </p>
          <Link
            href="/compose"
            className="mt-5 inline-block rounded-full bg-[var(--brand)] px-5 py-2 font-medium text-[var(--brand-ink)]"
          >
            New post
          </Link>
        </div>
      ) : (
        posts.map((p) => {
          const canManage = !!user && (isAdmin || p.author.id === user.id);
          return (
            <PostCard
              key={p.id}
              post={p}
              actions={
                canManage ? (
                  <PostActions id={p.id} title={p.title} body={p.body} />
                ) : undefined
              }
            />
          );
        })
      )}
    </div>
  );
}
