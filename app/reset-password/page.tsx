"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">(
    "checking",
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")
        setStatus("ready");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("ready");
    });
    // If no valid session appears, the link was expired or already used
    const timer = setTimeout(
      () => setStatus((s) => (s === "checking" ? "invalid" : s)),
      4000,
    );
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  }

  const box =
    "mx-auto mt-10 max-w-sm rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6";

  if (done) {
    return (
      <div className={box}>
        <h1 className="text-2xl font-semibold">Password updated</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Taking you to the feed…
        </p>
      </div>
    );
  }

  if (status === "checking") {
    return (
      <div className={box}>
        <p className="text-sm text-[var(--muted)]">Checking your link…</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className={box}>
        <h1 className="text-2xl font-semibold">Link expired</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This reset link is invalid or has already been used.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-sm font-medium text-[var(--brand)]"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className={box}>
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <form onSubmit={save} className="mt-5 space-y-4">
        <label className="block text-sm font-medium">
          New password (at least 8 characters)
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Confirm new password
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
