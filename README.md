# Learncity — Student Management System

A premium, minimalist student management system for an academy. Sign in, enroll
students, track their progress, and issue verified certificates of completion.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS v4**.
Brand theme locked to emerald `#10b981` → `#50B347`.

## Features

- **Login** — clean split-screen sign-in (mock client-side auth).
- **Dashboard overview** — roster stats (totals, graduates, average GPA,
  certificates) and recent enrollments.
- **Students list** — search by name / ID / email / program and filter by status.
- **Add / edit student** — validated form (personal details, program, status,
  GPA, progress, notes).
- **Student detail** — full record, academic snapshot, and quick actions.
- **Certificate** — auto-generated for graduated students, with **Download PDF**
  and **Print**.
- **Delete** — confirmation dialog before removing a record.

Data is stored in the browser (`localStorage`) and seeded with a sample roster on
first run, so the app works fully offline with no backend.

## Demo credentials

```
Email:    admin@learncity.io
Password: learncity
```

(Pre-filled on the login screen.)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- A certificate only becomes available once a student's status is set to
  **Graduated**. Diego Hernández and Leah Goldberg are seeded as graduates.
- To reset the roster to the seed data, clear the site's `localStorage`
  (keys are prefixed `learncity.`).

## Project structure

```
src/
  app/
    login/                         sign-in page
    dashboard/
      layout.tsx                   sidebar shell + auth guard
      page.tsx                     overview
      students/
        page.tsx                   list + search + filter
        new/                       add student
        [id]/                      detail
        [id]/edit/                 edit student
        [id]/certificate/          certificate view + PDF download
  components/                      UI primitives, brand, certificate, form
  lib/                             types, auth store, student store, utils, seed
```
