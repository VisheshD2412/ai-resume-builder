import { createClient } from "@supabase/supabase-js";

const FALLBACK_SECTION_RULE = "---------------------------------------";

/** Minimum length for an acceptable AI resume (after cleaning). */
const MIN_RESUME_CHARS = 80;

/**
 * Strips markdown artifacts, normalizes bullets and whitespace.
 * Does not change API contract — runs before persist/response only.
 */
function cleanResumeText(raw: string): string {
  let s = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Fenced code blocks (common LLM artifact)
  s = s.replace(/```[\s\S]*?```/g, "");

  // Markdown links [text](url) → text
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // ATX-style headings at line start
  s = s.replace(/^#{1,6}\s*/gm, "");

  // Line-leading list markers → bullet (before removing * globally)
  s = s
    .split("\n")
    .map((line) =>
      line.replace(
        /^(\s*)[-*]\s+(.*)$/,
        (_m, indent: string, rest: string) => `${indent}• ${rest}`,
      ),
    )
    .join("\n");

  s = s.replace(/\*\*/g, "");
  s = s.replace(/\*/g, "");

  s = s.replace(/`/g, "");

  s = s.replace(/\n{3,}/g, "\n\n");

  s = s
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trimEnd())
    .join("\n")
    .trim();

  return s;
}

function shouldUseStructuredFallback(cleaned: string): boolean {
  const t = cleaned.trim();
  if (!t.length) return true;
  if (t.length < MIN_RESUME_CHARS) return true;

  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);
  // Need at least two lines unless content is long enough to be a single solid block
  if (lines.length < 2 && t.length < 400) return true;

  return false;
}

function buildFallbackResume(body: {
  full_name?: string;
  email?: string;
  education?: string;
  experience?: string;
  skills?: string;
  target_role?: string;
}): string {
  const fullName = (body.full_name ?? "").trim().toUpperCase() || "YOUR NAME";
  const email = (body.email ?? "").trim() || "—";
  const targetRole = (body.target_role ?? "").trim() || "professional";
  const skillsRaw = (body.skills ?? "").trim();
  const education = body.education ?? "";
  const experience = body.experience ?? "";

  const skillItems = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const skillsForSummary =
    skillItems.length > 0
      ? skillItems.join(", ")
      : "relevant professional skills";

  const summaryBlock = [
    `Motivated ${targetRole} with skills in ${skillsForSummary}.`,
    "Passionate about building impactful solutions and continuously improving technical expertise.",
  ].join("\n");

  const skillsBlock =
    skillItems.length > 0
      ? skillItems.map((skill) => `• ${skill}`).join("\n")
      : "• —";

  const sections: string[] = [
    FALLBACK_SECTION_RULE,
    fullName,
    `${email} | —`,
    "",
    FALLBACK_SECTION_RULE,
    "SUMMARY",
    summaryBlock,
    "",
    FALLBACK_SECTION_RULE,
    "SKILLS",
    skillsBlock,
    "",
    FALLBACK_SECTION_RULE,
    "EDUCATION",
    education.trim() || "—",
    "",
    FALLBACK_SECTION_RULE,
    "EXPERIENCE",
    experience.trim() || "—",
    "",
    FALLBACK_SECTION_RULE,
  ];

  return sections.join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return Response.json(
        { error: "Missing OPENROUTER_API_KEY environment variable" },
        { status: 500 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        {
          error:
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        },
        { status: 500 },
      );
    }

    const prompt = `
Create a professional resume:

Name: ${body.full_name}
Email: ${body.email}
Education: ${body.education}
Experience: ${body.experience}
Skills: ${body.skills}
Target Role: ${body.target_role}

Format properly with sections and bullet points.
`;

    let generatedResume: string;
    try {
      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Resume Builder",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3-8b-instruct",
            messages: [{ role: "user", content: prompt }],
          }),
        },
      );

      if (!res.ok) {
        console.error("OPENROUTER ERROR", `HTTP ${res.status}`);
        generatedResume = buildFallbackResume(body);
      } else {
        const responseData = (await res.json()) as {
          choices?: Array<{ message?: { content?: string | null } }>;
        };

        const text = responseData.choices?.[0]?.message?.content;
        const trimmed =
          typeof text === "string" ? text.trim() : "";

        if (!trimmed) {
          console.error("OPENROUTER ERROR", "empty or invalid content");
          generatedResume = buildFallbackResume(body);
        } else {
          const cleaned = cleanResumeText(trimmed);
          if (shouldUseStructuredFallback(cleaned)) {
            console.error(
              "OPENROUTER ERROR",
              "output too short, empty, or malformed after cleaning — using structured fallback",
            );
            generatedResume = buildFallbackResume(body);
          } else {
            generatedResume = cleaned;
          }
        }
      }
    } catch (apiError) {
      console.error("OPENROUTER ERROR", apiError);
      generatedResume = buildFallbackResume(body);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error: insertError } = await supabase.from("resumes").insert({
      full_name: body.full_name,
      email: body.email,
      education: body.education,
      experience: body.experience,
      skills: body.skills,
      target_role: body.target_role,
      generated_resume: generatedResume,
    });

    if (insertError) {
      console.error("SUPABASE INSERT ERROR:", insertError);
      return Response.json(
        { error: "Failed to save resume", details: insertError.message },
        { status: 500 },
      );
    }

    return Response.json({ resume: generatedResume });
  } catch (error) {
    console.error("REQUEST ERROR:", error);
    return Response.json({ error: "Request failed" }, { status: 500 });
  }
}
