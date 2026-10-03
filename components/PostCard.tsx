import { Post } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import Avatar from "./Avatar";
import ImageGrid from "./ImageGrid";
import ExpandableText from "./ExpandableText";

export default function PostCard({
  post,
  actions,
}: {
  post: Post;
  actions?: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-3">
        <Avatar author={post.author} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">
            {post.author.fullName}
          </p>
          <p className="text-sm text-[var(--muted)]">
            {post.author.unit ? `${post.author.unit}, ` : ""}
            {timeAgo(post.createdAt)}
          </p>
        </div>
        {post.status === "pending" && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-[var(--warn)]">
            Awaiting review
          </span>
        )}
      </div>
      <ImageGrid images={post.images} />
      {post.title && (
        <h2 className="mt-3 text-xl font-semibold leading-snug">
          {post.title}
        </h2>
      )}
      {post.body && <ExpandableText text={post.body} />}
      {actions && (
        <div className="mt-4 flex gap-2 border-t border-[var(--line)] pt-3">
          {actions}
        </div>
      )}
    </article>
  );
}
