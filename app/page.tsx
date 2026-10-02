import Link from "next/link";
import PostCard from "@/components/PostCard";
import PostActions from "@/components/PostActions";
import { getPublishedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase-server";

export default async function Home() {
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

  const posts = await getPublishedPosts();

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="py-16 text-center">
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
