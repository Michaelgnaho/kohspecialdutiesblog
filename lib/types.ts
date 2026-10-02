export type Role = "admin" | "editor" | "member";
export type PostStatus = "draft" | "pending" | "published";

export interface Author {
  id: string;
  fullName: string;
  avatarUrl?: string;
  unit?: string;
}
export interface PostImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
}
export interface Post {
  id: string;
  author: Author;
  body: string;
  title: string;
  images: PostImage[];
  status: PostStatus;
  createdAt: string; // ISO date
}
