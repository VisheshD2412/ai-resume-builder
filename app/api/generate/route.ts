import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

function buildFallbackResume(body: {
  full_name?: string;
  email?: string;
  education?: string;
  experience?: string;
  skills?: string;
  target_role?: string;
}): string {
  return [
    `Name: ${body.full_name ?? ""}`,
    `Email: ${body.email ?? ""}`,
    `Target Role: ${body.target_role ?? ""}`,
    `Education: ${body.education ?? ""}`,
    `Experience: ${body.experience ?? ""}`,
    `Skills: ${body.skills ?? ""}`,
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY environment variable" },
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

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      // Current model supported with generateContent in Google AI SDK
      model: "gemini-2.0-flash",
    });

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
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text?.trim()) {
        throw new Error("Empty Gemini response");
      }
      generatedResume = text;
    } catch (geminiError) {
      console.error("GEMINI ERROR:", geminiError);
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
