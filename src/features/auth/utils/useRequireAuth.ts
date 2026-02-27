"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabaseClient } from "./supabaseClient";

export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      if (!data.session) {
        router.replace(redirectTo);
        return;
      }
      setChecking(false);
    };

    void checkSession();
  }, [redirectTo, router]);

  return { checking };
}
