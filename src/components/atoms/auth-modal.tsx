"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Chrome } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Mode = "sign-in" | "sign-up";

interface Props {
  onClose: () => void;
  defaultMode?: Mode;
}

export function AuthModal({ onClose, defaultMode = "sign-in" }: Props) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "sign-in") {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
      else onClose();
    } else {
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) setError(error.message);
      else setSuccess("Check your email to confirm your account.");
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError(null);
    await signInWithGoogle();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-t-3xl bg-secondary p-6 sm:rounded-2xl sm:shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-primary/40 hover:bg-primary/10 hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            {mode === "sign-in" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-primary/50">
            {mode === "sign-in"
              ? "Sign in to track your reading plans."
              : "Track your progress across all devices."}
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-[#4fa6c2]/10 p-4 text-sm text-[#4fa6c2]">
            {success}
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              onClick={handleGoogle}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              <Chrome className="h-4 w-4" />
              Continue with Google
            </button>

            <div className="mb-4 flex items-center gap-3 text-xs text-primary/30">
              <div className="flex-1 border-t border-primary/10" />
              or
              <div className="flex-1 border-t border-primary/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === "sign-up" && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/30" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-primary/20 bg-primary/5 py-3 pl-10 pr-4 text-sm text-primary placeholder:text-primary/30 focus:border-[#4fa6c2] focus:outline-none"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/30" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-primary/20 bg-primary/5 py-3 pl-10 pr-4 text-sm text-primary placeholder:text-primary/30 focus:border-[#4fa6c2] focus:outline-none"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/30" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-primary/20 bg-primary/5 py-3 pl-10 pr-4 text-sm text-primary placeholder:text-primary/30 focus:border-[#4fa6c2] focus:outline-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-xl bg-[#4fa6c2] py-3 text-sm font-bold text-white transition hover:bg-[#3d91ad] disabled:opacity-50"
              >
                {loading ? "…" : mode === "sign-in" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-primary/40">
              {mode === "sign-in" ? "No account? " : "Already have one? "}
              <button
                onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setError(null); }}
                className="text-[#4fa6c2] underline-offset-2 hover:underline"
              >
                {mode === "sign-in" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
