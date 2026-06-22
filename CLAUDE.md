# CDS Football Club — Context

## Projet
Site vitrine du club de foot amateur **CDS** (@cds_foot), 7-a-side, 2e division FLA Île-de-France, vendredi soir.
- **URL prod** : https://cds-football.vercel.app/
- **Stack** : Next.js 16 App Router + Tailwind CSS v4 + Supabase + Vercel
- **Repo** : https://github.com/Matteo-Hamaimi/cds-website

## Supabase
- **Project URL** : `https://gkrmmsbubvqqkuzbxdhc.supabase.co`
- **Anon key** : dans `.env.local` (ne pas commiter)
- **Storage bucket** : `cds-photos` (public)

## Tables Supabase
| Table | Colonnes clés |
|---|---|
| `prochain_match` | id, date_iso, adversaire, lieu, domicile |
| `classement` | id, position, equipe, pts, j, g, n, p, diff, is_cds |
| `resultats` | id, date_iso, domicile, exterieur, score_dom, score_ext |
| `effectif` | id, nom, surnom, numero, poste, actif, photo_url, buts, passes |
| `galerie` | id, photo_url, legende, created_at |

## RLS
- Lecture publique sur toutes les tables
- Écriture uniquement pour les utilisateurs authentifiés

## Design
- **Style** : Karmine Corp / esport — sobre, minimaliste
- **Palette** : `--bg: #f2f0eb` (beige), `--black: #0a0a0a`, `--gold: #E6B23C`, `--blue: #1E50C8`
- **Typo** : Barlow Condensed 900 pour les titres, Barlow pour le corps
- **Eyebrow labels** (AGENDA, CLASSEMENT…) : couleur `--blue`
- **Hero** : `<img>` avec `object-fit: cover`, texte centré en haut, header `position: fixed` transparent → beige au scroll

## Responsive
- **Header public** : JS resize detection (`window.innerWidth < 768`), burger mobile, liens desktop cachés
- **Admin** : CSS media query dans `globals.css` via classes `.admin-wrap`, `.admin-sidebar`, `.admin-topbar`, `.admin-main`, `.admin-menu`
  - Desktop : sidebar 220px fixe à gauche
  - Mobile : topbar sticky + menu déroulant, sidebar cachée

## Auth admin
- `onAuthStateChange` + `getSession` dans le layout — Supabase renouvelle le token automatiquement, pas besoin de se reconnecter
- Redirect vers `/admin/login` si pas de session

## Structure fichiers clés
```
app/
  page.tsx              — Home (Server Component, fetches all data)
  globals.css           — Fonts + CSS vars + classes admin responsive
  layout.tsx            — Root layout + preload hero + metadata/favicon
  admin/
    layout.tsx          — Auth guard + sidebar desktop + topbar mobile
    login/page.tsx      — Login form
    page.tsx            — Dashboard cards
    match/page.tsx      — Edit prochain match
    classement/page.tsx — Tableau éditable inline
    resultats/page.tsx  — Ajout/suppression résultats
    effectif/page.tsx   — CRUD joueurs + photo upload
    galerie/page.tsx    — Multi-upload photos
components/
  Header.tsx            — Fixed, transparent sur hero → beige au scroll (JS resize)
  ClientSections.tsx    — Toutes les sections publiques (client)
  Countdown.tsx         — Compte à rebours match
  Lightbox.tsx          — Galerie plein écran
lib/
  supabase.ts           — createBrowserClient + types TS
public/
  logo.png              — Logo RGBA PNG (transparent)
  favicon.ico           — Généré depuis logo.png
  apple-touch-icon.png  — 180x180
  icon-192.png          — PWA
  icon-512.png          — PWA
  team/hero.jpg         — Photo hero compressée 580KB (1920x1440)
```

## Commandes
```bash
npm run dev        # dev local sur localhost:3000
npx vercel --prod  # déployer en prod
```

## Pièges connus
- `@import url(Google Fonts)` doit être AVANT `@import "tailwindcss"` dans globals.css
- Le header est `position: fixed` — le hero fait `100svh` pour compenser (iOS safe area)
- Les images Supabase Storage nécessitent `remotePatterns: *.supabase.co` dans next.config.ts
- `createBrowserClient` uniquement côté client (`'use client'`)
- RLS actif : les mutations admin nécessitent une session Supabase valide
- Ne pas utiliser `className="hidden md:flex"` avec `display: flex` en style inline — Tailwind est écrasé
- Hero photo : utiliser `<img object-fit: cover>` pas `background-image` (évite le débordement sur iOS)

## Upload photos
- **Joueurs** : `/admin/effectif` → éditer un joueur → champ photo
- **Galerie** : `/admin/galerie` → upload multi-fichiers direct
- Les fichiers vont dans le bucket `cds-photos` sur Supabase Storage
