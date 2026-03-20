import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>

      <div className="mt-8">
        <Link
          href="/create-resume"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create New Resume
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <p className="text-zinc-600">No resumes yet</p>
      </section>
    </main>
  );
}
