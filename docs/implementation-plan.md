Phase 0 — Setup (Foundation)
Task 0.1 — Initialize Project

Create Next.js app (App Router + Tailwind)

Clean default files

Set basic folder structure

Task 0.2 — Environment Setup

Create .env.local

Add placeholders:

GEMINI_API_KEY

SUPABASE_URL

SUPABASE_ANON_KEY

Phase 1 — Database & Auth
Task 1.1 — Setup Supabase Project

Create new Supabase project

Copy API keys

Task 1.2 — Create Database Table

Table: resumes

Fields:

id (uuid)

user_id (uuid)

full_name (text)

email (text)

education (text)

experience (text)

skills (text)

target_role (text)

generated_resume (text)

created_at (timestamp)

Task 1.3 — Setup Authentication

Enable email auth (magic link)

Test login/logout flow

Phase 2 — UI Foundation
Task 2.1 — Landing Page

Hero section

CTA button (“Get Started”)

Basic layout

Task 2.2 — Dashboard Page

“Create Resume” button

Placeholder for resume list

Task 2.3 — Resume Form Page

Form inputs:

Name

Email

Education

Experience

Skills

Target Role

Phase 3 — AI Integration
Task 3.1 — Create API Route

Path:

/app/api/generate/route.ts

Function:

Accept form data

Send prompt to Gemini API

Return generated resume text

Task 3.2 — Prompt Design

Prompt should:

Structure resume

Use bullet points

Be professional

Task 3.3 — Connect Frontend to API

Submit form → call API

Show loading state

Display result

Phase 4 — Data Storage
Task 4.1 — Save Resume to Database

Store generated output in Supabase

Task 4.2 — Fetch User Resumes

Display previous resumes in dashboard

Phase 5 — PDF Generation
Task 5.1 — Convert Resume to PDF

Generate downloadable PDF from output

Task 5.2 — Add Download Button

“Download Resume” functionality

Phase 6 — Polish & Deployment
Task 6.1 — UI Improvements

Clean spacing

Responsive design

Better typography

Task 6.2 — Error Handling

Form validation

API error fallback

Task 6.3 — Deploy

Push to GitHub

Deploy on Vercel

Add environment variables

🎯 Execution Rules (IMPORTANT)

Do ONE task at a time

Test after each task

Commit after each working step

Do NOT jump phases
