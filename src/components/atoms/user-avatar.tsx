"use client";

import { useState } from "react";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "./auth-modal";

export function UserAvatar() {
  const { user, loading, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-primary/5">
        <div className="h-3 w-3 animate-pulse rounded-full bg-primary/20" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary/60 transition hover:border-[#4fa6c2]/50 hover:text-[#4fa6c2]"
          aria-label="Sign in"
        >
          <User className="h-4 w-4" />
        </button>

        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  // Logged in — show initials or avatar
  const initials = (user.user_metadata?.full_name as string | undefined)
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? user.email?.[0].toUpperCase() ?? "U";

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#4fa6c2]/60 bg-[#4fa6c2]/20 text-xs font-bold text-[#4fa6c2] transition hover:border-[#4fa6c2]"
        aria-label="User menu"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-11 z-40 min-w-[160px] rounded-xl border border-primary/10 bg-secondary p-1 shadow-lg">
            <div className="px-3 py-2 text-xs text-primary/40 truncate max-w-[160px]">
              {user.email}
            </div>
            <hr className="border-primary/10 my-1" />
            <button
              onClick={async () => { await signOut(); setShowMenu(false); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
