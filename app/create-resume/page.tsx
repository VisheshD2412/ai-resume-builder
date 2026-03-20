export default function CreateResumePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Create Resume
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Fill in your details to generate your professional resume.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="education"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Education
            </label>
            <textarea
              id="education"
              name="education"
              rows={4}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Add your education details"
            />
          </div>

          <div>
            <label
              htmlFor="experience"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Experience
            </label>
            <textarea
              id="experience"
              name="experience"
              rows={5}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Add your work experience"
            />
          </div>

          <div>
            <label
              htmlFor="skills"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g. JavaScript, SQL, Communication"
            />
          </div>

          <div>
            <label
              htmlFor="targetRole"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Target Role
            </label>
            <input
              id="targetRole"
              name="targetRole"
              type="text"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            >
              Generate Resume
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
