import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          AI Resume Builder
        </h1>
        <p className="mt-4 text-lg text-zinc-600 sm:text-xl">
          Build your professional resume in minutes using AI
        </p>
        <Link
          href="/dashboard"
          className="mt-10 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
