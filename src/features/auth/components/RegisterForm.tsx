import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabaseClient } from "@/features/auth/utils/supabaseClient";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/onboarding/profile");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-3xl text-black">Club Kit</h1>
        <p className="text-gray-500 text-md">アカウントを作成</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm outline-none focus:border-gray-300"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm outline-none focus:border-gray-300"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm outline-none focus:border-gray-300"
            placeholder="パスワード（8文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white disabled:opacity-60"
        >
          {loading ? "作成中..." : "アカウント作成"}
        </button>
      </form>

      <div className="space-y-5 text-center text-gray-500 text-xs">
        <p>
          すでにアカウントをお持ちの方は{" "}
          <a href="/login" className="underline">
            ログイン
          </a>
        </p>
        <p>デモモード用の値でも登録できます</p>
      </div>
    </div>
  );
}
