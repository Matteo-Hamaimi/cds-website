-- ═══════════════════════════════════════════
-- CDS Football Club — Supabase Schema
-- Coller dans : Supabase > SQL Editor > Run
-- ═══════════════════════════════════════════

-- Prochain match
create table if not exists prochain_match (
  id         serial primary key,
  date_iso   timestamptz not null,
  adversaire text not null,
  lieu       text not null,
  domicile   boolean not null default true,
  updated_at timestamptz default now()
);

-- Classement
create table if not exists classement (
  id       serial primary key,
  position integer not null,
  equipe   text not null,
  pts      integer not null default 0,
  j        integer not null default 0,
  g        integer not null default 0,
  n        integer not null default 0,
  p        integer not null default 0,
  diff     integer not null default 0,
  is_cds   boolean not null default false
);

-- Résultats
create table if not exists resultats (
  id         serial primary key,
  date_iso   date not null,
  domicile   text not null,
  exterieur  text not null,
  score_dom  integer not null,
  score_ext  integer not null,
  created_at timestamptz default now()
);

-- Effectif
create table if not exists effectif (
  id        serial primary key,
  nom       text not null,
  surnom    text not null,
  numero    integer not null,
  poste     text not null check (poste in ('Gardien','Défenseur','Milieu','Attaquant')),
  photo_url text default '',
  buts      integer not null default 0,
  passes    integer not null default 0,
  actif     boolean not null default true
);

-- Galerie
create table if not exists galerie (
  id         serial primary key,
  photo_url  text not null,
  legende    text not null default '',
  date_iso   date,
  match_ref  text default '',
  created_at timestamptz default now()
);

-- ── RLS (Row Level Security) ─────────────────
-- Lecture publique sur tout
alter table prochain_match enable row level security;
alter table classement      enable row level security;
alter table resultats       enable row level security;
alter table effectif        enable row level security;
alter table galerie         enable row level security;

create policy "public read prochain_match" on prochain_match for select using (true);
create policy "public read classement"     on classement     for select using (true);
create policy "public read resultats"      on resultats      for select using (true);
create policy "public read effectif"       on effectif       for select using (true);
create policy "public read galerie"        on galerie        for select using (true);

-- Écriture uniquement pour les utilisateurs authentifiés (admin)
create policy "auth write prochain_match" on prochain_match for all using (auth.role() = 'authenticated');
create policy "auth write classement"     on classement     for all using (auth.role() = 'authenticated');
create policy "auth write resultats"      on resultats      for all using (auth.role() = 'authenticated');
create policy "auth write effectif"       on effectif       for all using (auth.role() = 'authenticated');
create policy "auth write galerie"        on galerie        for all using (auth.role() = 'authenticated');

-- ── Storage bucket pour les photos ───────────
insert into storage.buckets (id, name, public)
values ('cds-photos', 'cds-photos', true)
on conflict do nothing;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'cds-photos');

create policy "auth upload photos" on storage.objects
  for insert with check (bucket_id = 'cds-photos' and auth.role() = 'authenticated');

create policy "auth delete photos" on storage.objects
  for delete using (bucket_id = 'cds-photos' and auth.role() = 'authenticated');

-- ── Données initiales ─────────────────────────
insert into prochain_match (date_iso, adversaire, lieu, domicile) values
  ('2026-06-27T20:00:00+02:00', 'AS Belleville FC', 'Terrain Pelleport, Paris 20e', true);

insert into classement (position, equipe, pts, j, g, n, p, diff, is_cds) values
  (1, 'Olympique Charonne', 31, 12, 10, 1, 1,  22, false),
  (2, 'AS Belleville FC',   27, 12,  8, 3, 1,  15, false),
  (3, 'CDS',                22, 12,  7, 1, 4,   8, true),
  (4, 'RC Vincennes Est',   18, 12,  5, 3, 4,   2, false),
  (5, 'FC Ménilmontant',    14, 12,  4, 2, 6,  -4, false),
  (6, 'Stade Gambetta',     11, 12,  3, 2, 7, -11, false),
  (7, 'US Bagnolet Nord',    7, 12,  2, 1, 9, -16, false),
  (8, 'Athletic Montreuil',  4, 12,  1, 1,10, -24, false);

insert into resultats (date_iso, domicile, exterieur, score_dom, score_ext) values
  ('2026-06-13', 'CDS',              'Stade Gambetta',     4, 1),
  ('2026-06-06', 'RC Vincennes Est', 'CDS',                2, 2),
  ('2026-05-30', 'CDS',              'Athletic Montreuil', 5, 0),
  ('2026-05-23', 'AS Belleville FC', 'CDS',                3, 1),
  ('2026-05-16', 'CDS',              'FC Ménilmontant',    2, 2),
  ('2026-05-09', 'US Bagnolet Nord', 'CDS',                0, 3),
  ('2026-05-02', 'CDS',              'Olympique Charonne', 1, 2);

insert into effectif (nom, surnom, numero, poste, buts, passes) values
  ('Hamaimi',   'Matteo',  1,  'Gardien',   0, 1),
  ('Dumont',    'Kévin',   4,  'Défenseur', 1, 3),
  ('Traoré',    'Issa',    5,  'Défenseur', 2, 2),
  ('Fernandez', 'Carlos',  6,  'Milieu',    4, 5),
  ('Mbaye',     'Oumar',   8,  'Milieu',    5, 7),
  ('Petit',     'Antoine', 9,  'Attaquant', 9, 4),
  ('Cissé',     'Mamadou', 10, 'Attaquant', 7, 6),
  ('Nguyen',    'Théo',    11, 'Attaquant', 6, 3);
