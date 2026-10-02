import { Post } from "./types";
// Sample data so the UI works before Supabase is connected. Delete once live.
export const MOCK_POSTS: Post[] = [
  { id: "1", status: "published", createdAt: new Date(Date.now() - 3600e3).toISOString(),
    author: { id: "a", fullName: "Amina Bello", unit: "Field Team" },
    body: "Ward outreach in Ikeja went well today. Residents shared their priorities for the next four years.",
    images: [] },
  { id: "2", status: "pending", createdAt: new Date(Date.now() - 7200e3).toISOString(),
    author: { id: "b", fullName: "Tunde Adeyemi", unit: "Media" },
    body: "Setting up for tomorrow's town hall. Volunteers, please arrive by 8am.", images: [] },
];
