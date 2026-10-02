"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SITE } from "@/lib/config";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/`,
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setSent(true); // email confirmation is on
    }
  }

  const box =
    "mx-auto mt-10 max-w-sm rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6";

  if (sent) {
    return (
      <div className={box}>
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We sent a confirmation link to {email}. Click it, then sign in.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-[var(--brand)]"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={box}>
      <h1 className="text-2xl font-semibold">Create account</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Join {SITE.name} to post updates.
      </p>
      <form onSubmit={signUp} className="mt-5 space-y-4">
        <label className="block text-sm font-medium">
          Full name
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </label>
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
          Password (at least 8 characters)
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button className="w-full rounded-full bg-[var(--brand)] py-2.5 font-medium text-[var(--brand-ink)]">
          Create account
        </button>
      </form>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--brand)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
