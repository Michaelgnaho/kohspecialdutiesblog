import { supabase } from "./supabase";

export async function createPost(input: {
  title: string;
  body: string;
  imagePaths: string[];
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: input.title,
      body: input.body,
      status: "published",
    })
    .select("id")
    .single();
  if (error) throw error;

  if (input.imagePaths.length) {
    const rows = input.imagePaths.map((storage_path, i) => ({
      post_id: post.id,
      storage_path,
      sort_order: i,
    }));
    const { error: imgError } = await supabase.from("post_images").insert(rows);
    if (imgError) throw imgError;
  }
}

export async function setPostStatus(id: string, status: "published" | "draft") {
  const { error } = await supabase
    .from("posts")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
export async function updatePost(id: string, title: string, body: string) {
  const { error } = await supabase
    .from("posts")
    .update({ title, body })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  // Remove the photo files first; the photo rows disappear with the post
  const { data: imgs } = await supabase
    .from("post_images")
    .select("storage_path")
    .eq("post_id", id);
  if (imgs?.length) {
    await supabase.storage
      .from("post-images")
      .remove(imgs.map((i) => i.storage_path));
  }
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}
