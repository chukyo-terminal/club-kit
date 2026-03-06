"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabaseClient } from "./supabaseClient";

type UseRequireAuthOptions = {
  redirectTo?: string;
  requireProfile?: boolean;
  profileRedirectTo?: string;
};

function isBlank(value: string | null | undefined) {
  return (value ?? "").trim().length === 0;
}

export function useRequireAuth(options: string | UseRequireAuthOptions = "/login") {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = typeof options === "string" ? options : (options.redirectTo ?? "/login");
  const requireProfile = typeof options === "string" ? false : (options.requireProfile ?? false);
  const profileRedirectTo =
    typeof options === "string"
      ? "/onboarding/profile"
      : (options.profileRedirectTo ?? "/onboarding/profile");

  useEffect(() => {
    const checkSession = async () => {
      setError(null);

      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        setChecking(false);
        return;
      }

      if (!sessionData.session) {
        router.replace(redirectTo);
        return;
      }

      if (requireProfile) {
        const userId = sessionData.session.user.id;
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("student_id, avatar_url, faculty, grade")
          .eq("user_id", userId)
          .maybeSingle();

        if (profileError) {
          setError(profileError.message);
          setChecking(false);
          return;
        }

        const complete =
          !(isBlank(profile?.student_id) || isBlank(profile?.faculty)) &&
          typeof profile?.grade === "number";

        if (!complete) {
          router.replace(profileRedirectTo);
          return;
        }
      }

      setChecking(false);
    };

    void checkSession();
  }, [profileRedirectTo, redirectTo, requireProfile, router]);

  return { checking, error };
}
