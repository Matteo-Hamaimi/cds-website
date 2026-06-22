import { supabase } from '@/lib/supabase'
import type { ProchainMatch, ClassementRow, Resultat, Joueur, GaleriePhoto } from '@/lib/supabase'
import Header from '@/components/Header'
import ClientSections from '@/components/ClientSections'
import Image from 'next/image'

export const revalidate = 60

async function getData() {
  const [match, classement, resultats, effectif, galerie] = await Promise.all([
    supabase.from('prochain_match').select('*').order('id', { ascending: false }).limit(1).single(),
    supabase.from('classement').select('*').order('position'),
    supabase.from('resultats').select('*').order('date_iso', { ascending: false }).limit(7),
    supabase.from('effectif').select('*').eq('actif', true).order('numero'),
    supabase.from('galerie').select('*').order('created_at', { ascending: false }),
  ])
  return {
    match: match.data as ProchainMatch | null,
    classement: (classement.data ?? []) as ClassementRow[],
    resultats: (resultats.data ?? []) as Resultat[],
    effectif: (effectif.data ?? []) as Joueur[],
    galerie: (galerie.data ?? []) as GaleriePhoto[],
  }
}

export default async function Home() {
  const { match, classement, resultats, effectif, galerie } = await getData()

  return (
    <>
      <Header />

      {/* HERO — height inclut le header fixe (60px) */}
      <section id="hero" style={{ position: 'relative', height: '100vh', minHeight: 620, overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/team/hero.jpg')", backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'brightness(.48) saturate(.75)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 45%)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 20px 0' }}>
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(.58rem,.68rem + .1vw,.68rem)', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 12 }}>
            Foot à 7 &nbsp;·&nbsp; FLA Île-de-France &nbsp;·&nbsp; Since 2025
          </p>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(5rem,14vw,10rem)', fontWeight: 900, color: '#fff', letterSpacing: '-.03em', lineHeight: .88, textTransform: 'uppercase', marginBottom: 22 }}>
            CDS
          </h1>
          <div style={{ width: 32, height: 2, background: '#E6B23C', marginBottom: 16, opacity: .9 }} />
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1rem', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>
            2<sup style={{ fontSize: '.72em' }}>e</sup>&nbsp;division &nbsp;·&nbsp; Vendredi soir
          </p>
        </div>
      </section>

      <ClientSections match={match} classement={classement} resultats={resultats} effectif={effectif} galerie={galerie} />

      {/* FOOTER */}
      <footer style={{ padding: '56px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, background: 'var(--black)' }}>
        <Image src="/logo.png" alt="CDS" width={52} height={68} style={{ height: 52, width: 'auto', opacity: .6 }} />
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.4rem', fontWeight: 900, color: 'var(--bg)', letterSpacing: '.06em', textTransform: 'uppercase' }}>CDS Football Club</p>
        <a href="https://instagram.com/cds_foot" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.8rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#444', textDecoration: 'none' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          @cds_foot
        </a>
        <p style={{ fontSize: '.65rem', color: '#333' }}>Since 2025 · FLA Île-de-France</p>
      </footer>
    </>
  )
}
