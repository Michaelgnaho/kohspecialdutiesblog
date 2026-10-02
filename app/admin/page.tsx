import { redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import ReviewActions from "@/components/ReviewActions";
import { getPendingPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") redirect("/");

  const posts = await getPendingPosts();
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Posts to review</h1>
      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-[var(--muted)]">
            Nothing waiting. New posts will show up here.
          </p>
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} actions={<ReviewActions id={p.id} />} />
        ))}
      </div>
    </>
  );
}
