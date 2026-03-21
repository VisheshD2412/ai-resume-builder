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

/** Recognized section headings for ATS-style resumes (case-insensitive). */
const SECTION_HEADINGS = new Set([
  "summary",
  "skills",
  "education",
  "experience",
  "work experience",
  "professional experience",
  "professional summary",
  "objective",
  "contact",
  "certifications",
  "projects",
]);

function isSectionTitle(line: string): boolean {
  return SECTION_HEADINGS.has(line.trim().toLowerCase());
}

function ResumeBlock({ block }: { block: string }) {
  const trimmed = block.trim();
  if (!trimmed) return null;

  const newlineIdx = trimmed.indexOf("\n");
  const firstLine =
    newlineIdx === -1 ? trimmed : trimmed.slice(0, newlineIdx).trim();
  const rest =
    newlineIdx === -1 ? "" : trimmed.slice(newlineIdx + 1);

  if (isSectionTitle(firstLine) && rest.trim()) {
    return (
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
          {firstLine.toUpperCase()}
        </h3>
        <div className="mt-3 space-y-2 whitespace-pre-line text-[15px] leading-relaxed text-gray-900">
          {rest}
        </div>
      </div>
    );
  }

  return (
    <div className="whitespace-pre-line text-[15px] leading-relaxed text-gray-900">
      {trimmed}
    </div>
  );
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
  const sections = resumeBody.split(/\n\n+/).filter((block: string) => block.trim());

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition hover:text-indigo-600"
        >
          <span aria-hidden>←</span> Back to Dashboard
        </Link>

        <article className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-black shadow-lg sm:p-10">
          <header className="border-b border-gray-200 pb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Saved resume
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-black">
              {data.full_name ?? "Resume"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-relaxed text-gray-600">
              <span className="font-medium text-gray-800">
                {data.target_role ?? "—"}
              </span>
              <span className="hidden text-gray-300 sm:inline" aria-hidden>
                ·
              </span>
              <time className="text-gray-500">
                {formatCreatedAt(data.created_at)}
              </time>
            </div>
          </header>

          <div className="space-y-8 pt-8">
            {sections.length > 0 ? (
              sections.map((block: string, index: number) => (
                <ResumeBlock key={index} block={block} />
              ))
            ) : (
              <div className="whitespace-pre-line text-[15px] leading-relaxed text-gray-900">
                {resumeBody}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
