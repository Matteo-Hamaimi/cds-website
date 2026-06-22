import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Poste = 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant'

export interface ProchainMatch {
  id: number
  date_iso: string
  adversaire: string
  lieu: string
  domicile: boolean
}

export interface ClassementRow {
  id: number
  position: number
  equipe: string
  pts: number
  j: number
  g: number
  n: number
  p: number
  diff: number
  is_cds: boolean
}

export interface Resultat {
  id: number
  date_iso: string
  domicile: string
  exterieur: string
  score_dom: number
  score_ext: number
}

export interface Joueur {
  id: number
  nom: string
  surnom: string
  numero: number
  poste: Poste
  photo_url: string
  buts: number
  passes: number
  actif: boolean
}

export interface GaleriePhoto {
  id: number
  photo_url: string
  legende: string
  date_iso: string | null
  match_ref: string
}
