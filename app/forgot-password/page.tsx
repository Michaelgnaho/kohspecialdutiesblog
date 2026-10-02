"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      setError(
        "We could not send the email right now. Wait a few minutes and try again.",
      );
      return;
    }
    setSent(true);
  }

  const box =
    "mx-auto mt-10 max-w-sm rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6";

  if (sent) {
    return (
      <div className={box}>
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          If an account exists for {email}, we sent a link to reset the
          password. Open it in this same browser.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-[var(--brand)]"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={box}>
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Enter your email and we will send you a link to set a new password.
      </p>
      <form onSubmit={send} className="mt-5 space-y-4">
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
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full rounded-full bg-[var(--brand)] py-2.5 font-medium text-[var(--brand-ink)] disabled:opacity-40"
        >
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <Link
        href="/login"
        className="mt-4 inline-block text-sm text-[var(--muted)]"
      >
        Back to sign in
      </Link>
    </div>
  );
}
