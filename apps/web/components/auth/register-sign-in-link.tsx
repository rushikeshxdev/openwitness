"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { safeAuthNext } from "@/lib/auth-session";

export function RegisterSignInLink() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const href =
    next && safeAuthNext(next) !== "/events"
      ? `/login?next=${encodeURIComponent(safeAuthNext(next))}`
      : "/login";

  return (
    <p className="text-sm text-zinc-400">
      Already have an account?{" "}
      <Link
        href={href}
        className="font-semibold text-[#60A5FA] hover:text-white"
      >
        Sign in
      </Link>
    </p>
  );
}
