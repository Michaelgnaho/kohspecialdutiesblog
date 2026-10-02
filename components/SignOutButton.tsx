"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="text-[var(--muted)] hover:text-[var(--ink)]"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
