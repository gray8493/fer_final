"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../lib/supabase/client";

type Profile = Record<string, unknown>;

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setError(null);
      setLoading(true);
      try {
        const supabase = supabaseBrowser();
        const { data, error } = await supabase.from("profiles").select("*").limit(5);
        if (error) {
          throw error;
        }
        setProfiles(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 bg-white px-6 py-16 text-zinc-900 dark:bg-black dark:text-zinc-100 sm:px-10">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">
          Supabase + Next.js (App Router)
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Kết nối Supabase đã được cài sẵn.
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Thiết lập biến môi trường trong <code>.env.local</code> rồi chạy{" "}
          <code>npm run dev</code>. Ví dụ dưới lấy 5 dòng đầu từ bảng{" "}
          <code>profiles</code>.
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Profiles</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Đọc trực tiếp bằng Supabase client trên browser.
            </p>
          </div>
          {loading && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              Đang tải...
            </span>
          )}
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            {error}
            <div className="mt-2 text-xs text-red-500 dark:text-red-300">
              Đảm bảo đã set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY.
            </div>
          </div>
        )}

        {!error && !loading && profiles.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Không có bản ghi nào trong bảng <code>profiles</code>.
          </p>
        )}

        {!error && profiles.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="grid grid-cols-1 divide-y divide-zinc-200 dark:divide-zinc-800">
              {profiles.map((row, idx) => (
                <div key={idx} className="px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200">
                  <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-zinc-700 dark:text-zinc-300">
                    {JSON.stringify(row, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-dashed border-zinc-200 p-6 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
        <p className="font-medium">Checklist:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Đặt <code>NEXT_PUBLIC_SUPABASE_URL</code> và <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> trong <code>.env.local</code>.</li>
          <li>Nếu cần quyền cao, thêm <code>SUPABASE_SERVICE_ROLE_KEY</code> (chỉ dùng ở server).</li>
          <li>API mẫu: <code>GET /api/profiles</code> đọc 10 dòng đầu từ bảng <code>profiles</code>.</li>
        </ul>
      </section>
    </main>
  );
}
