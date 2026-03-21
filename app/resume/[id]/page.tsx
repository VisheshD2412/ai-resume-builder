import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";

type PageProps = {
  params: Promise<{ id: string }>;
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

export default async function ResumeDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("full_name, target_role, created_at, generated_resume")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const resumeBody = data.generated_resume ?? "";
  const sections = resumeBody.split(/\n\n+/).filter((block) => block.trim());

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 sm:py-16">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
      >
        <span aria-hidden>←</span> Back to Dashboard
      </Link>

      <header className="mt-8 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-md shadow-zinc-900/5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Saved resume
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {data.full_name ?? "Resume"}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-600">
          <span className="font-medium text-zinc-700">
            {data.target_role ?? "—"}
          </span>
          <span className="hidden text-zinc-300 sm:inline" aria-hidden>
            ·
          </span>
          <time className="text-zinc-500">{formatCreatedAt(data.created_at)}</time>
        </div>
      </header>

      <section className="mt-6 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-md shadow-zinc-900/5 sm:p-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Full resume
        </h2>
        <div className="mt-6 space-y-8">
          {sections.length > 0
            ? sections.map((block, index) => (
                <div
                  key={index}
                  className="border-b border-zinc-100 pb-8 last:border-0 last:pb-0"
                >
                  <pre className="whitespace-pre-wrap font-sans text-[15px] leading-7 text-zinc-800">
                    {block}
                  </pre>
                </div>
              ))
            : (
                <pre className="whitespace-pre-wrap font-sans text-[15px] leading-7 text-zinc-800">
                  {resumeBody}
                </pre>
              )}
        </div>
      </section>
    </main>
  );
}
