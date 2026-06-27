"use client";

import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const supabase = createClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ user: session?.user ?? null, session, loading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({ user: session?.user ?? null, session, loading: false });
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      return supabase.auth.signInWithPassword({ email, password });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, fullName?: string) => {
      return supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signInWithGoogle = useCallback(
    async (redirectTo?: string) => {
      return supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo ?? window.location.origin },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signOut = useCallback(async () => {
    return supabase.auth.signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut };
}
