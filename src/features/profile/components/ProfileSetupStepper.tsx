"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { supabaseClient } from "@/features/auth/utils/supabaseClient";

type ProfileDraft = {
  studentId: string;
  faculty: string;
  grade: string;
  avatarFile: File | null;
  avatarUrl: string;
};

function isBlank(value: string) {
  return value.trim().length === 0;
}

function getFileExt(fileName: string) {
  const parts = fileName.split(".");
  if (parts.length < 2) return "png";
  return parts.at(-1)?.toLowerCase() ?? "png";
}

export function ProfileSetupStepper() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [avatarObjectUrl, setAvatarObjectUrl] = useState("");

  const [draft, setDraft] = useState<ProfileDraft>({
    studentId: "",
    faculty: "",
    grade: "",
    avatarFile: null,
    avatarUrl: "",
  });

  useEffect(() => {
    if (!draft.avatarFile) {
      setAvatarObjectUrl("");
      return;
    }
    const url = URL.createObjectURL(draft.avatarFile);
    setAvatarObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [draft.avatarFile]);

  const avatarPreviewUrl = useMemo(() => {
    if (avatarObjectUrl) return avatarObjectUrl;
    if (!isBlank(draft.avatarUrl)) return draft.avatarUrl;
    return "";
  }, [avatarObjectUrl, draft.avatarUrl]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFatalError(null);

      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) {
        setFatalError(sessionError.message);
        setLoading(false);
        return;
      }
      const session = sessionData.session;
      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("student_id, faculty, grade, avatar_url")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profileError) {
        setFatalError(profileError.message);
        setLoading(false);
        return;
      }

      const studentId = profile?.student_id ?? "";
      const faculty = profile?.faculty ?? "";
      const grade = profile?.grade ? String(profile.grade) : "";
      const avatarUrl = profile?.avatar_url ?? "";

      const complete = !(isBlank(studentId) || isBlank(faculty) || isBlank(grade));

      if (complete) {
        router.replace("/circles");
        return;
      }

      setDraft((prev) => ({
        ...prev,
        studentId,
        faculty,
        grade,
        avatarUrl,
      }));

      setLoading(false);
    };

    void load();
  }, [router]);

  const steps = [
    { title: "学生番号" },
    { title: "学部" },
    { title: "学年" },
    { title: "アイコン" },
  ] as const;

  const validateCurrentStep = () => {
    setFieldError(null);

    if (step === 0) {
      if (isBlank(draft.studentId)) return "学生番号を入力してください。";
      if (draft.studentId.trim().length > 32) return "学生番号は32文字以内で入力してください。";
    }
    if (step === 1) {
      if (isBlank(draft.faculty)) return "学部を入力してください。";
      if (draft.faculty.trim().length > 64) return "学部は64文字以内で入力してください。";
    }
    if (step === 2) {
      if (isBlank(draft.grade)) return "学年を選択してください。";
      const n = Number(draft.grade);
      if (!Number.isInteger(n) || n < 1 || n > 4) return "学年は1〜4の整数で入力してください。";
    }

    return null;
  };

  const goNext = () => {
    const message = validateCurrentStep();
    if (message) {
      setFieldError(message);
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    setFieldError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleFinish = async () => {
    const message = validateCurrentStep();
    if (message) {
      setFieldError(message);
      return;
    }

    setSaving(true);
    setFatalError(null);
    setFieldError(null);

    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError) {
      setFatalError(sessionError.message);
      setSaving(false);
      return;
    }
    const session = sessionData.session;
    if (!session) {
      router.replace("/login");
      return;
    }

    let avatarUrl = draft.avatarUrl.trim();

    if (draft.avatarFile) {
      const ext = getFileExt(draft.avatarFile.name);
      const objectPath = `${session.user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("avatars")
        .upload(objectPath, draft.avatarFile, {
          upsert: true,
          cacheControl: "3600",
          contentType: draft.avatarFile.type || undefined,
        });

      if (uploadError) {
        setFatalError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabaseClient.storage
        .from("avatars")
        .getPublicUrl(objectPath);

      avatarUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({
        student_id: draft.studentId.trim(),
        faculty: draft.faculty.trim(),
        grade: Number(draft.grade),
        avatar_url: avatarUrl,
      })
      .eq("user_id", session.user.id);

    if (updateError) {
      setFatalError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.replace("/circles");
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg px-4">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (fatalError) {
    return (
      <div className="w-full max-w-lg space-y-3 px-4">
        <h1 className="font-semibold text-black text-xl">プロフィール設定でエラーが発生しました</h1>
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
          {fatalError}
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white"
          onClick={() => router.refresh()}
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg space-y-6 px-4">
      <header className="space-y-1">
        <h1 className="font-semibold text-2xl text-black">初期プロフィール設定</h1>
        <p className="text-gray-500 text-sm">
          サークル機能を使う前に、プロフィール情報を入力してください。
        </p>
      </header>

      <nav aria-label="手順" className="space-y-2">
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <span>
            {step + 1}/{steps.length}
          </span>
          <span>{steps[step].title}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-gray-900 transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <ol className="flex gap-2" aria-label="ステップ一覧">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={[
                "flex-1 rounded-md border px-2 py-2 text-center text-xs",
                i === step
                  ? "border-gray-900 text-gray-900"
                  : i < step
                    ? "border-gray-200 text-gray-600"
                    : "border-gray-200 text-gray-400",
              ].join(" ")}
            >
              {s.title}
            </li>
          ))}
        </ol>
      </nav>

      <section className="rounded-md border border-gray-200 bg-white p-4">
        {step === 0 && (
          <fieldset className="space-y-2">
            <legend className="font-medium text-black text-sm">学生番号</legend>
            <input
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 text-sm outline-none focus:border-gray-300"
              placeholder="例: 23A1234"
              value={draft.studentId}
              onChange={(e) => setDraft((d) => ({ ...d, studentId: e.target.value }))}
              inputMode="text"
              autoComplete="off"
            />
            <p className="text-gray-500 text-xs">後から変更できます。</p>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-2">
            <legend className="font-medium text-black text-sm">学部</legend>
            <input
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 text-sm outline-none focus:border-gray-300"
              placeholder="例: 工学部"
              value={draft.faculty}
              onChange={(e) => setDraft((d) => ({ ...d, faculty: e.target.value }))}
              inputMode="text"
              autoComplete="organization"
            />
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-2">
            <legend className="font-medium text-black text-sm">学年</legend>
            <select
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 text-sm outline-none focus:border-gray-300"
              value={draft.grade}
              onChange={(e) => setDraft((d) => ({ ...d, grade: e.target.value }))}
            >
              <option value="">選択してください</option>
              {Array.from({ length: 4 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>
                  {n}年
                </option>
              ))}
            </select>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-3">
            <legend className="font-medium text-black text-sm">アイコン</legend>

            <div className="flex items-start gap-3">
              <div className="size-16 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                {avatarPreviewUrl ? (
                  <Image
                    src={avatarPreviewUrl}
                    alt="アイコンプレビュー"
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="block">
                  <span className="text-gray-700 text-xs">画像をアップロード</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file && file.size > 2 * 1024 * 1024) {
                        setFieldError("画像サイズは2MB以下にしてください。");
                        return;
                      }
                      setDraft((d) => ({
                        ...d,
                        avatarFile: file,
                        avatarUrl: file ? "" : d.avatarUrl,
                      }));
                    }}
                  />
                </label>

                <div className="text-gray-400 text-xs">または</div>

                <label className="block">
                  <span className="text-gray-700 text-xs">画像URLを入力</span>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 text-sm outline-none focus:border-gray-300"
                    placeholder="https://..."
                    value={draft.avatarUrl}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        avatarUrl: e.target.value,
                        avatarFile: null,
                      }))
                    }
                    inputMode="url"
                    autoComplete="url"
                  />
                </label>
              </div>
            </div>
          </fieldset>
        )}

        {fieldError && (
          <p className="mt-3 text-red-600 text-sm" role="alert">
            {fieldError}
          </p>
        )}
      </section>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 text-sm disabled:opacity-60"
          disabled={step === 0 || saving}
          onClick={goBack}
        >
          戻る
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white disabled:opacity-60"
            disabled={saving}
            onClick={goNext}
          >
            次へ
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white disabled:opacity-60"
            disabled={saving}
            onClick={handleFinish}
          >
            {saving ? "保存中..." : "完了してサークルへ"}
          </button>
        )}
      </div>
    </div>
  );
}
