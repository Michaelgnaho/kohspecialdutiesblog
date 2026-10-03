import { createClient } from "./supabase-server";
import { imageUrl } from "./image-url";
import { Post } from "./types";

const SELECT =
  "id,title, body, status, created_at, profiles(id, full_name, avatar_url, unit), post_images(id, storage_path, width, height, sort_order)";

function toPost(row: any): Post {
  return {
    id: row.id,
    title: row.title ?? "",
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
    author: {
      id: row.profiles.id,
      fullName: row.profiles.full_name || "Member",
      avatarUrl: row.profiles.avatar_url ?? undefined,
      unit: row.profiles.unit ?? undefined,
    },
    images: [...(row.post_images ?? [])]
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((i: any) => ({
        id: i.id,
        url: imageUrl(i.storage_path),
        width: i.width,
        height: i.height,
      })),
  };
}

export type PostSort = "newest" | "oldest" | "title";

export async function getPublishedPosts(
  page = 0,
  pageSize = 20,
  opts: { q?: string; sort?: PostSort } = {},
): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase.from("posts").select(SELECT).eq("status", "published");

  // Strip characters that have special meaning in PostgREST filters / LIKE patterns
  const term = (opts.q ?? "")
    .replace(/[%_\\,()*"]/g, " ")
    .trim()
    .slice(0, 100);
  if (term) {
    query = query.or(`title.ilike.%${term}%,body.ilike.%${term}%`);
  }

  if (opts.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (opts.sort === "title") {
    query = query
      .order("title", { ascending: true })
      .order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.range(
    page * pageSize,
    page * pageSize + pageSize - 1,
  );
  if (error) throw error;
  return (data ?? []).map(toPost);
}

export async function getPendingPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(SELECT)
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toPost);
}
