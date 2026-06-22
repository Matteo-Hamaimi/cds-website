# CDS Football Club — Context

## Projet
Site vitrine du club de foot amateur **CDS** (@cds_foot), 7-a-side, 2e division FLA Île-de-France, vendredi soir.
- **URL prod** : https://cds-football.vercel.app/
- **Stack** : Next.js 16 App Router + Tailwind CSS v4 + Supabase + Vercel

## Supabase
- **Project URL** : `https://gkrmmsbubvqqkuzbxdhc.supabase.co`
- **Anon key** : dans `.env.local` (ne pas commiter)
- **Storage bucket** : `cds-photos` (public)

## Tables Supabase
| Table | Colonnes clés |
|---|---|
| `prochain_match` | id, date_iso, adversaire, lieu, domicile |
| `classement` | id, position, equipe, pts, j, g, n, p, bp, bc |
| `resultats` | id, date_iso, adversaire, score_nous, score_eux, domicile |
| `effectif` | id, nom, numero, poste, actif, photo_url, buts, passes |
| `galerie` | id, photo_url, legende, created_at |

## RLS
- Lecture publique sur toutes les tables
- Écriture uniquement pour les utilisateurs authentifiés

## Design
- **Style** : Karmine Corp / esport — sobre, minimaliste
- **Palette** : `--bg: #f2f0eb` (beige), `--black: #0a0a0a`, `--gold: #E6B23C`, `--blue: #1E50C8`
- **Typo** : Barlow Condensed 900 pour les titres, Barlow pour le corps
- **Hero** : photo plein écran `public/team/hero.jpg`, texte centré en haut, header transparent qui devient beige au scroll

## Structure fichiers clés
```
app/
  page.tsx              — Home (Server Component, fetches all data)
  globals.css           — Fonts + CSS vars (Google Fonts AVANT @import tailwindcss)
  layout.tsx            — Root layout
  admin/
    layout.tsx          — Auth guard + sidebar
    login/page.tsx      — Login form
    page.tsx            — Dashboard
    match/page.tsx      — Edit prochain match
    classement/page.tsx
    resultats/page.tsx
    effectif/page.tsx   — CRUD joueurs + photo upload vers Supabase Storage
    galerie/page.tsx    — Multi-upload photos
components/
  Header.tsx            — Fixed, transparent sur hero → beige au scroll
  ClientSections.tsx    — Toutes les sections publiques (client)
  Countdown.tsx         — Compte à rebours match
  Lightbox.tsx          — Galerie plein écran
lib/
  supabase.ts           — createBrowserClient + types TS
public/
  logo.png              — Logo RGBA PNG (transparent)
  team/hero.jpg         — Photo hero EXIF-corrigée
```

## Commandes
```bash
npm run dev        # dev local sur localhost:3000
npx vercel --prod  # déployer en prod
```

## Pièges connus
- `@import url(Google Fonts)` doit être AVANT `@import "tailwindcss"` dans globals.css
- Le header est `position: fixed` — le hero fait `100vh` pour compenser
- Les images Supabase Storage nécessitent `remotePatterns: *.supabase.co` dans next.config.ts
- `createBrowserClient` uniquement côté client (`'use client'`)
- RLS actif : les mutations admin nécessitent une session Supabase valide
- Pas de `border` ou `outline` sur les `<Image>` Next.js (générer artefacts blancs)

## Upload photos
- **Joueurs** : `/admin/effectif` → éditer un joueur → champ photo
- **Galerie** : `/admin/galerie` → upload multi-fichiers direct
- Les fichiers vont dans le bucket `cds-photos` sur Supabase Storage
