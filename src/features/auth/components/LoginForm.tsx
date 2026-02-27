import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabaseClient } from "@/features/auth/utils/supabaseClient";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("tanaka@university.ac.jp");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/circles");
  };

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-3xl text-black">Club Kit</h1>
        <p className="text-gray-500 text-md">サークル運営をシンプルに</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            type="email"
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm outline-none focus:border-gray-300"
            placeholder="tanaka@university.ac.jp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm outline-none focus:border-gray-300"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white disabled:opacity-60"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <div className="space-y-5 text-center text-gray-500 text-xs">
        <p>
          アカウントをお持ちでない方は{" "}
          <a href="/register" className="underline">
            新規登録
          </a>
        </p>
        <p>デモモード用の値でもログインできます</p>
      </div>
    </div>
  );
}
