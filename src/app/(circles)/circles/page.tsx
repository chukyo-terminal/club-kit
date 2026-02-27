"use client";

import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { RxExit } from "react-icons/rx";
import { useRequireAuth } from "@/features/auth/utils/useRequireAuth";
export default function CirclesPage() {
  const { checking } = useRequireAuth();
  const [joinCode, setJoinCode] = useState("");
  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ヘッダー */}
      <header className="flex items-center justify-between border-gray-200 border-b px-6 py-4">
        <div className="font-semibold text-black text-xl">Club Kit</div>
        <div className="flex items-center gap-5 text-gray-600 text-sm">
          <span className="text-gray-500 text-sm">田中 太郎</span>
          <button
            type="button"
            className="flex items-center gap-1 text-gray-600 text-sm hover:text-gray-800"
          >
            <span className="flex items-center gap-1">
              <RxExit className="size-4" />
              <span>ログアウト</span>
            </span>
          </button>
        </div>
      </header>

      {/* コンテンツ */}
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xl space-y-8 px-4">
          <section className="space-y-4">
            <div className="space-y-1">
              <h1 className="font-semibold text-2xl text-black">サークルに参加</h1>
              <p className="text-gray-500 text-lg">部活IDまたは招待コードを入力してください</p>
            </div>

            <form className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800 text-sm outline-none focus:border-gray-300"
                placeholder="部活ID / 招待コード"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button
                type="submit"
                disabled={!joinCode}
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white disabled:opacity-60"
              >
                参加
              </button>
            </form>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <div className="h-px w-full bg-gray-200" />
              <span className="whitespace-nowrap">または</span>
              <div className="h-px w-full bg-gray-200" />
            </div>
          </section>

          <section>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-gray-300 border-dashed bg-gray-50 px-4 py-2 text-left text-sm hover:border-gray-400"
            >
              <div className="flex items-center gap-3">
                <FiPlusCircle className="size-7 text-gray-500" />
                <div className="space-y-1">
                  <p className="font-medium text-black text-sm">新しいサークルを作成</p>
                  <p className="text-gray-500 text-xs">管理者として新規作成</p>
                </div>
              </div>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
