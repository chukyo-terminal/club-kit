"use client";

import { useRequireAuth } from "@/features/auth/utils/useRequireAuth";
import { ProfileSetupStepper } from "@/features/profile/components/ProfileSetupStepper";

export function ProfileSetupPageClient() {
  const { checking } = useRequireAuth("/login");

  if (checking) {
    return <p className="text-gray-500 text-sm">読み込み中...</p>;
  }

  return <ProfileSetupStepper />;
}
