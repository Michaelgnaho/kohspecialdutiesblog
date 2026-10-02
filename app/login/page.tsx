"use client";
import { useState } from "react";
import { SITE } from "@/lib/config";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Email or password is incorrect.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto mt-10 max-w-sm rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {SITE.name} members only. Ask an admin for access.
      </p>
      <form onSubmit={signIn} className="mt-5 space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[var(--brand)]"
            >
              Forgot password?
            </Link>
          </div>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button className="w-full rounded-full bg-[var(--brand)] py-2.5 font-medium text-[var(--brand-ink)]">
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm text-[var(--muted)]">
        New here?{" "}
        <a href="/signup" className="font-medium text-[var(--brand)]">
          Create account
        </a>
      </p>
    </div>
  );
}
