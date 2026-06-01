# CareLoop

CareLoop is a mobile-first childcare management app for daycare centers.

The goal is to help parents and daycare staff communicate through check-ins, daily reports, photos, videos, forms, incident reports, menus, learning updates, and secure parent dashboards.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase planned for auth, database, and storage
- Vercel planned for deployment

## Current Status

This repo currently contains the landing page and demo dashboard preview.

## Demo Flow

Current interactive demo:

1. Open `/app/staff`
2. Click `Create update`
3. Select a child and update type
4. Post a demo update
5. Open `/app/parent`
6. The update appears in the parent's timeline using local browser storage

This is temporary demo behavior. Later this will move to Supabase with real auth, database rows, storage, permissions, and audit logs.
