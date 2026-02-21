⚙️ Technical Specification
Product: AI Resume Builder

Version: v1 (MVP)

1️⃣ System Architecture Overview

This application will be a full-stack web application built using:

Next.js (frontend + API routes)

Supabase (database + authentication)

OpenAI API (resume generation)

Vercel (deployment)

Architecture style:
Monolithic full-stack app (simple, fast, scalable enough for MVP)

2️⃣ Frontend Layer
Framework

Next.js (App Router)

Styling

Tailwind CSS

Responsibilities

Render landing page

Render dashboard

Render resume form

Display AI-generated resume

Handle loading + error states

Call backend API routes

3️⃣ Backend Layer

Backend will use:

Next.js API Routes (no separate server)

Responsibilities:

Handle AI resume generation request

Validate user input

Securely call OpenAI API

Save generated resume to database

Fetch user resume history

No separate Express server required.

4️⃣ Database Layer

Provider:

Supabase (PostgreSQL)

Tables
users (managed by Supabase Auth)

We rely on Supabase Auth user table.

resumes

Columns:

id (uuid, primary key)

user_id (uuid, foreign key)

full_name (text)

email (text)

education (text)

experience (text)

skills (text)

target_role (text)

generated_resume (text)

created_at (timestamp)

Each resume is linked to user_id.

5️⃣ Authentication

Provider:

Supabase Auth

Method:

Magic Link (email-based)

Requirements:

Only authenticated users can generate resumes

Users can only access their own resumes

Row-Level Security enabled in Supabase

6️⃣ AI Integration

Provider:

OpenAI API

Model:

gpt-4o-mini (cost-efficient)

Flow:

User submits resume form

Backend constructs structured prompt

API route sends request to OpenAI

Receives formatted resume text

Saves result in database

Returns response to frontend

7️⃣ Environment Variables

These must be stored in .env.local and never exposed:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY (server only)

OPENAI_API_KEY

These are required for deployment.

8️⃣ PDF Generation

Approach:

Generate formatted resume HTML

Convert to PDF client-side or server-side

Allow download

Keep simple for v1:
Client-side PDF generation.

9️⃣ Deployment

Frontend + Backend:

Vercel

Database + Auth:

Supabase Cloud

Deployment Steps:

Push repo to GitHub

Import project in Vercel

Add environment variables

Deploy

🔟 Security Considerations

Never expose OpenAI API key in frontend

Use server-side API route for AI calls

Enable Supabase Row-Level Security

Validate required fields before AI call

Basic rate limiting (optional in v1)

11️⃣ Scalability (Future Consideration)

Not implemented in v1, but architecture allows:

Adding Stripe subscriptions

Adding multiple resume templates

Adding cover letter generator

Adding resume scoring

Upgrading to multi-model AI routing
