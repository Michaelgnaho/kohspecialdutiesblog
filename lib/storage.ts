import { supabase } from "./supabase";

export async function compress(file: File): Promise<File> {
  const { default: imageCompression } =
    await import("browser-image-compression");
  return imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  });
}

// Uploads one photo and returns its storage PATH (we store the path, not the full link).
export async function uploadImage(file: File): Promise<string> {
  const small = await compress(file);
  const ext = (small.name.split(".").pop() || "jpg").toLowerCase();
  const path = `posts/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, small, { contentType: small.type });
  if (error) throw error;
  return path;
}
