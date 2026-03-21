import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 px-6 py-20">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center space-y-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
          AI-powered
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
          AI Resume Builder
        </h1>
        <p className="max-w-xl text-lg font-medium leading-relaxed text-gray-300 sm:text-xl">
          Build your professional resume in minutes using AI
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-indigo-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 active:scale-[0.99]"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
