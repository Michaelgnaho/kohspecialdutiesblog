import Link from "next/link";
import { SITE } from "@/lib/config";
import { createClient } from "@/lib/supabase-server";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isStaff = false;
  if (user) {
    const { data: me } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isStaff = me?.role === "admin";
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {SITE.logoUrl && (
            <img src={SITE.logoUrl} alt="" className="h-8 w-8 rounded" />
          )}
          <span className="font-[family-name:var(--font-head)] text-lg font-semibold">
            {SITE.name}
          </span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-4 text-sm">
            {/* admin tools appear on each post */}
            <SignOutButton />
            <Link
              href="/compose"
              className="rounded-full bg-[var(--brand)] px-4 py-2 font-medium text-[var(--brand-ink)]"
            >
              New post
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[var(--brand)] px-4 py-2 font-medium text-[var(--brand-ink)]"
            >
              Create account
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
