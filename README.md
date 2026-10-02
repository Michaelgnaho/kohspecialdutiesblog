# Directorate blog: front end

Copy these folders into your Next.js project (App Router, TypeScript, Tailwind).

    npm i browser-image-compression

Search the project for `TODO` to find every place to connect Supabase or add your own details:

1. lib/config.ts      site name, tagline, logo
2. lib/supabase.ts    create this: createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) from .env.local
3. lib/posts.ts       replace the 4 functions with Supabase queries
4. lib/storage.ts     upload + public URL (bucket name: post-images)
5. app/login          Supabase sign-in
6. Header, /compose, /admin   add auth checks and role checks
7. next.config        add your Supabase domain under images.remotePatterns when you switch <img> to next/image

Delete lib/mock-data.ts once real data flows.
