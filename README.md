# River Bank Jungle Resort — Website

Production website for **River Bank Jungle Resort**, Bharatpur-22, Patihani, Chitwan, Nepal.
Replaces the legacy site at riverbankjungleresort.com.np.

**Stack:** Next.js 15 (App Router) · Custom Admin System · MongoDB (Mongoose) · Tailwind CSS 4 · TypeScript · Framer Motion · next-intl

## Quick start

```bash
# 1. Install
pnpm install

# 2. Start MongoDB (any local instance works; Docker example:)
docker run -d --name riverbank-mongo -p 27017:27017 -v riverbank-mongo-data:/data/db mongo:7

# 3. Configure
cp .env.example .env   # defaults work for local dev

# 4. Seed demo content (rooms, dining, experiences, blog, FAQs, images…)
pnpm seed

# 5. Run
pnpm dev
```

- Site: http://localhost:3000
- Custom Admin panel: http://localhost:3000/admin — `admin@riverbankjungleresort.com.np` / `riverbank123`
  (change the password immediately in production; set `SEED_ADMIN_PASSWORD` before seeding to pick your own)

## What's inside

| Area | Where |
| --- | --- |
| Database & Models | `src/lib/db/models/` — Mongoose schemas matching MongoDB collections (Rooms, DiningVenues, Experiences, Offers, BlogPosts, Testimonials, FAQs, GalleryImages, Amenities, FormSubmissions, NewsletterSignups, Users, Sessions, Settings) |
| Custom Admin Panel | `src/app/admin/` — Complete authenticated admin panel with Dashboard, CRUD forms, Lexical rich text editor, Media library manager, Enquiries, and Settings |
| Site-wide settings | `src/app/admin/(protected)/settings` / `src/lib/services/settings.ts` (contact info, socials, booking URLs, hero banners, footer) |
| Frontend pages | `src/app/(frontend)/[locale]/` |
| Design tokens | `src/app/(frontend)/globals.css` (`@theme` — swap colors/fonts here to restyle) |
| Motion wrappers | `src/components/motion.tsx` (`FadeUp`, `StaggerGroup`, `ScaleOnHover`) |
| SEO helpers | `src/lib/seo.ts` (metadata), `src/lib/jsonld.ts` (Resort/FAQ/BlogPosting/Breadcrumb schema) |
| Sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Legacy 301 redirects | `next.config.ts` → `redirects()` |
| i18n scaffold | `src/i18n/` + `messages/` — English live, Nepali ready at `/np` (translate `messages/np.json`) |
| Seed script | `src/seed/index.ts` (`pnpm seed`, idempotent) |

## Content notes

- **All copy is river/Terai-correct.** The old site wrongly advertised "mountain vistas" — this resort is
  on the flat Terai floodplain beside the Rapti River. Keep it that way.
- **Location is Patihani (Bharatpur-22), not Sauraha.** The FAQs state this explicitly.
- **Booking:** there is no booking engine. All Book Now buttons link to the external direct-booking page
  (configurable in Site Settings).
- **Placeholder images** live in `public/placeholders/` — Chitwan photos from Wikimedia Commons
  (CC-licensed) plus Unsplash interiors. Replace them with the resort's own photography via the CMS
  (Media + each collection's image fields); the placeholders are only fallbacks.

## Deploying

- [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) — Vercel (MongoDB Atlas + Vercel Blob for media)
- [DEPLOY.md](DEPLOY.md) — self-managed Linux VPS (Node 20+, PM2 + Nginx)
