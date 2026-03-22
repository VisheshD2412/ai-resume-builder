"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

type ResumeRow = {
  id: string;
  full_name: string | null;
  target_role: string | null;
  created_at: string;
};

function formatCreatedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (error) {
          console.error("Dashboard fetch error:", error);
          setLoadError(error.message);
          setResumes([]);
        } else {
          setLoadError(null);
          setResumes((data ?? []) as ResumeRow[]);
        }
      } catch (e) {
        if (cancelled) return;
        console.error("Dashboard fetch error:", e);
        setLoadError(
          e instanceof Error ? e.message : "Could not load resumes.",
        );
        setResumes([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12 sm:py-16">
      <header className="border-b border-zinc-200/80 pb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-600">
          Overview
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-xl text-base text-zinc-600">
          Your saved resumes appear here. Create a new one anytime.
        </p>
      </header>

      <div className="mt-8">
        <Link
          href="/create-resume"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.99]"
        >
          Create New Resume
        </Link>
      </div>

      {loadError ? (
        <p className="mt-8 rounded-xl border border-amber-200/90 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950 shadow-sm">
          {loadError}
        </p>
      ) : null}

      <section className="mt-10">
        {loading ? (
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-8 text-center shadow-md shadow-zinc-900/5">
            <p className="text-base font-medium text-zinc-600">
              Loading resumes…
            </p>
          </div>
        ) : null}

        {!loading && !loadError && resumes.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-8 text-center shadow-md shadow-zinc-900/5">
            <p className="text-base font-medium text-zinc-900">No resumes yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Generate a resume to see it listed here.
            </p>
          </div>
        ) : null}

        {!loading && !loadError && resumes.length > 0 ? (
          <ul className="space-y-4">
            {resumes.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-md shadow-zinc-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-lg font-semibold leading-snug text-zinc-900">
                    {row.full_name ?? "—"}
                  </p>
                  <p className="text-sm font-medium text-zinc-600">
                    {row.target_role ?? "—"}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    {formatCreatedAt(row.created_at)}
                  </p>
                </div>
                <Link
                  href={`/resume/${row.id}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.99]"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
