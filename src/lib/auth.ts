import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

/** Redirects to /login?redirect=<current path> when there is no session. */
export function useRequireAuth() {
  const { user, loading } = useAuthSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [loading, user, navigate, pathname]);

  return { user, loading };
}

export async function signOut() {
  await supabase.auth.signOut();
}
