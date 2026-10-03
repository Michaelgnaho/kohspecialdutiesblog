"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/config";
import SignOutButton from "./SignOutButton";
import SearchBar from "./SearchBar";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] md:hidden";

export default function Navbar({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const showSearch = !AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Close the mobile panels whenever the page changes
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  const pill =
    "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium md:py-2";
  const solid = `${pill} bg-[var(--brand)] text-[var(--brand-ink)]`;
  const outline = `${pill} border border-[var(--line)] bg-[var(--surface)]`;

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2.5 md:flex-none"
        >
          {SITE.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={SITE.logoUrl}
              alt={`${SITE.tagline} logo`}
              className="h-10 w-auto shrink-0 rounded-md bg-white md:h-11"
            />
          )}
          <span className="line-clamp-2 font-[family-name:var(--font-head)] text-[15px] font-semibold leading-tight md:text-lg">
            {SITE.name}
          </span>
        </Link>

        {/* Mobile-only toggles */}
        {showSearch && (
          <button
            type="button"
            aria-label="Search posts"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              setMenuOpen(false);
            }}
            className={iconBtn}
          >
            <SearchIcon />
          </button>
        )}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((v) => !v);
            setSearchOpen(false);
          }}
          className={iconBtn}
        >
          <MenuIcon open={menuOpen} />
        </button>

        {/* Search + sort: inline on desktop, drops below the bar on mobile */}
        {showSearch && (
          <div
            className={`order-last w-full md:order-none md:block md:w-auto md:flex-1 ${searchOpen ? "block" : "hidden"}`}
          >
            <Suspense fallback={null}>
              <SearchBar autoFocus={searchOpen} />
            </Suspense>
          </div>
        )}

        {/* Account actions: inline on desktop, stacked full-width panel on mobile */}
        <nav
          className={`order-last w-full flex-col gap-2 pb-1 md:order-none md:flex md:w-auto md:flex-row md:items-center md:gap-3 md:pb-0 ${menuOpen ? "flex" : "hidden"}`}
        >
          {signedIn ? (
            <>
              <Link href="/compose" className={solid}>
                New post
              </Link>
              <div className="flex justify-center text-sm md:block [&>button]:w-full [&>button]:rounded-full [&>button]:border [&>button]:border-[var(--line)] [&>button]:py-2.5 md:[&>button]:w-auto md:[&>button]:border-0 md:[&>button]:py-0">
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={outline}>
                Sign in
              </Link>
              <Link href="/signup" className={solid}>
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
