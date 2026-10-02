import { PostImage } from "@/lib/types";

export default function ImageGrid({ images }: { images: PostImage[] }) {
  if (!images.length) return null;
  const shown = images.slice(0, 4);
  const extra = images.length - 4;
  const cols = shown.length === 1 ? "grid-cols-1" : "grid-cols-2";
  return (
    <div className={`mt-3 grid gap-1 overflow-hidden rounded-lg ${cols}`}>
      {shown.map((img, i) => (
        <div key={img.id} className={`relative ${shown.length === 1 ? "aspect-[4/3]" : "aspect-square"}`}>
          {/* TODO: switch to next/image once your Supabase domain is added to next.config remotePatterns */}
          <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
          {i === 3 && extra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-semibold text-white">
              +{extra}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
