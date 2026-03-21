"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type FormValues = {
  full_name: string;
  email: string;
  education: string;
  experience: string;
  skills: string;
  target_role: string;
};

const initialFormValues: FormValues = {
  full_name: "",
  email: "",
  education: "",
  experience: "",
  skills: "",
  target_role: "",
};

export default function CreateResumePage() {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setResumeText("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = (await response.json()) as { resume?: string; error?: string };

      if (!response.ok || !data.resume) {
        setErrorMessage(data.error ?? "Failed to generate resume.");
        return;
      }

      setResumeText(data.resume);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-12 sm:py-16">
      <section className="w-full rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-md shadow-zinc-900/5 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          New resume
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Create Resume
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
          Fill in your details to generate your professional resume.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="full_name"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formValues.full_name}
              onChange={handleChange}
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
              value={formValues.email}
              onChange={handleChange}
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
              value={formValues.education}
              onChange={handleChange}
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
              value={formValues.experience}
              onChange={handleChange}
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
              value={formValues.skills}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g. JavaScript, SQL, Communication"
            />
          </div>

          <div>
            <label
              htmlFor="target_role"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Target Role
            </label>
            <input
              id="target_role"
              name="target_role"
              type="text"
              value={formValues.target_role}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? "Generating..." : "Generate Resume"}
            </button>
          </div>
        </form>

        {errorMessage ? (
          <p className="mt-8 rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800 shadow-sm">
            {errorMessage}
          </p>
        ) : null}

        {resumeText ? (
          <section className="mt-10 rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-6 shadow-inner sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Generated resume
            </h2>
            <div className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-zinc-900">
              {resumeText}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
