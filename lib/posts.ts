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

export async function getPublishedPosts(
  page = 0,
  pageSize = 20,
): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);
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
