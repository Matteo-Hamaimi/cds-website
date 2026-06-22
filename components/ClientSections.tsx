'use client'
import { useState } from 'react'
import type { ProchainMatch, ClassementRow, Resultat, Joueur, GaleriePhoto } from '@/lib/supabase'
import Countdown from './Countdown'
import Lightbox from './Lightbox'

const W = { maxWidth: 1200, margin: '0 auto', padding: '0 20px' }
const S = { padding: '72px 0', borderBottom: '1px solid var(--border)' }

const Eyebrow = ({ children }: { children: string }) => (
  <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase' as const, color: 'var(--blue)', marginBottom: 10 }}>{children}</p>
)
const STitle = ({ children }: { children: string }) => (
  <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(2rem,5vw,3.8rem)', fontWeight: 900, color: 'var(--black)', letterSpacing: '-.02em', textTransform: 'uppercase' as const, lineHeight: 1, marginBottom: 32 }}>{children}</h2>
)

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Prochain match ──────────────────────────────────────────────────────────
function MatchSection({ match }: { match: ProchainMatch | null }) {
  if (!match) return null
  const dt = new Date(match.date_iso)
  const dateStr = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={W}><div style={S}>
      <Eyebrow>Agenda</Eyebrow>
      <STitle>Prochain match</STitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'start' }}>
        <div style={{ flex: '1 1 260px' }}>
          <span style={{ display: 'inline-block', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 2, marginBottom: 20, ...(match.domicile ? { background: 'var(--black)', color: 'var(--bg)' } : { background: 'var(--surface)', color: 'var(--soft)', border: '1px solid var(--border)' }) }}>
            {match.domicile ? 'Domicile' : 'Extérieur'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' as const }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(1.2rem,4vw,1.5rem)', fontWeight: 900, color: 'var(--black)', textTransform: 'uppercase' as const }}>
              {match.domicile ? 'CDS' : match.adversaire}
            </span>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', color: 'var(--border)' }}>VS</span>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(1.2rem,4vw,1.5rem)', fontWeight: 900, color: 'var(--black)', textTransform: 'uppercase' as const }}>
              {match.domicile ? match.adversaire : 'CDS'}
            </span>
          </div>
          <div style={{ fontSize: '.82rem', color: 'var(--soft)', lineHeight: 2 }}>
            <div>{dateStr}</div>
            <div>{match.lieu}</div>
          </div>
        </div>
        <div>
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--soft)', marginBottom: 12 }}>Dans</p>
          <Countdown dateIso={match.date_iso} />
        </div>
      </div>
    </div></div>
  )
}

// ── Classement ──────────────────────────────────────────────────────────────
function ClassementSection({ rows }: { rows: ClassementRow[] }) {
  const th: React.CSSProperties = { padding: '10px 12px', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--soft)', textAlign: 'center' }
  const td = (cds: boolean): React.CSSProperties => ({ padding: '11px 12px', fontSize: '.87rem', color: cds ? 'rgba(255,255,255,.6)' : 'var(--soft)', textAlign: 'center', borderBottom: '1px solid var(--border)', background: cds ? 'var(--black)' : 'var(--white)' })

  return (
    <div style={W}><div id="classement" style={S}>
      <Eyebrow>Ligue FLA — 2e division</Eyebrow>
      <STitle>Classement</STitle>
      <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 320 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              <th style={{ ...th, textAlign: 'left', width: 36 }}>#</th>
              <th style={{ ...th, textAlign: 'left' }}>Équipe</th>
              <th style={th}>Pts</th>
              <th style={th}>J</th>
              <th style={{ ...th }} className="hidden sm:table-cell">G</th>
              <th style={{ ...th }} className="hidden sm:table-cell">N</th>
              <th style={{ ...th }} className="hidden sm:table-cell">P</th>
              <th style={th}>Diff</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const diff = r.diff > 0 ? `+${r.diff}` : String(r.diff)
              const diffColor = r.diff > 0 ? (r.is_cds ? '#E6B23C' : '#16a34a') : r.diff < 0 ? '#dc2626' : '#999'
              return (
                <tr key={r.id}>
                  <td style={{ ...td(r.is_cds), textAlign: 'left', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '.95rem', color: r.is_cds ? '#E6B23C' : 'var(--soft)' }}>{r.position}</td>
                  <td style={{ ...td(r.is_cds), textAlign: 'left' }}>
                    <span style={{ fontWeight: r.is_cds ? 700 : 500, color: r.is_cds ? '#fff' : 'var(--black)' }}>{r.equipe}</span>
                  </td>
                  <td style={{ ...td(r.is_cds), fontWeight: 700, fontSize: '.95rem', color: r.is_cds ? '#fff' : 'var(--black)' }}>{r.pts}</td>
                  <td style={td(r.is_cds)}>{r.j}</td>
                  <td style={td(r.is_cds)} className="hidden sm:table-cell">{r.g}</td>
                  <td style={td(r.is_cds)} className="hidden sm:table-cell">{r.n}</td>
                  <td style={td(r.is_cds)} className="hidden sm:table-cell">{r.p}</td>
                  <td style={{ ...td(r.is_cds), color: diffColor, fontWeight: 600 }}>{diff}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div></div>
  )
}

// ── Résultats ───────────────────────────────────────────────────────────────
function ResultatsSection({ rows }: { rows: Resultat[] }) {
  return (
    <div style={W}><div id="resultats" style={S}>
      <Eyebrow>Saison 2025–26</Eyebrow>
      <STitle>Résultats</STitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        {rows.map(r => {
          const isDom = r.domicile === 'CDS'
          const isExt = r.exterieur === 'CDS'
          let res = 'N'
          if (isDom) res = r.score_dom > r.score_ext ? 'V' : r.score_dom < r.score_ext ? 'D' : 'N'
          if (isExt) res = r.score_ext > r.score_dom ? 'V' : r.score_ext < r.score_dom ? 'D' : 'N'
          const lbl = { V: 'Victoire', N: 'Nul', D: 'Défaite' }[res]!
          const cls = { V: { background: 'var(--black)', color: 'var(--bg)' }, N: { background: 'var(--surface)', color: 'var(--soft)', border: '1px solid var(--border)' }, D: { background: 'var(--surface)', color: 'var(--soft)', border: '1px solid var(--border)' } }[res]!
          return (
            <div key={r.id} style={{ background: 'var(--white)', padding: '18px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.68rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--soft)' }}>{fmtDate(r.date_iso)}</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.62rem', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 2, ...cls }}>{lbl}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isDom ? 'var(--black)' : 'var(--soft)' }}>{r.domicile}</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(1.1rem,4vw,1.5rem)', fontWeight: 900, whiteSpace: 'nowrap', textAlign: 'center', background: 'var(--black)', color: 'var(--bg)', padding: '4px 10px', borderRadius: 2 }}>{r.score_dom}–{r.score_ext}</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', color: isExt ? 'var(--black)' : 'var(--soft)' }}>{r.exterieur}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div></div>
  )
}

// ── Effectif ────────────────────────────────────────────────────────────────
function EffectifSection({ joueurs }: { joueurs: Joueur[] }) {
  return (
    <div style={W}><div id="effectif" style={S}>
      <Eyebrow>Saison 2025–26</Eyebrow>
      <STitle>Effectif</STitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,180px),1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        {joueurs.map(j => {
          const init = (j.surnom[0] + j.nom[0]).toUpperCase()
          return (
            <div key={j.id} style={{ background: 'var(--white)', padding: '18px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.88rem', fontWeight: 800, color: 'var(--soft)', overflow: 'hidden', flexShrink: 0 }}>
                  {j.photo_url ? <img src={j.photo_url} alt={j.surnom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : init}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.06em', color: 'var(--soft)', marginBottom: 2 }}>#{j.numero}</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1rem', fontWeight: 900, color: 'var(--black)', textTransform: 'uppercase', letterSpacing: '.02em', lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.surnom}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.nom}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, marginTop: 12, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.66rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--soft)' }}>{j.poste}</span>
                <span style={{ fontSize: '.7rem', color: 'var(--soft)' }}>{j.buts}G &nbsp;{j.passes}A</span>
              </div>
            </div>
          )
        })}
      </div>
    </div></div>
  )
}

// ── Galerie ─────────────────────────────────────────────────────────────────
function GalerieSection({ photos }: { photos: GaleriePhoto[] }) {
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null)
  return (
    <div style={W}><div id="galerie" style={S}>
      <Eyebrow>Photos</Eyebrow>
      <STitle>Galerie</STitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,200px),1fr))', gap: 4 }}>
        {photos.map(g => (
          <div key={g.id} onClick={() => setLb({ src: g.photo_url, alt: g.legende })}
               style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1', background: 'var(--surface)', cursor: 'pointer', borderRadius: 4 }}
               onMouseOver={e => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1.06)'; (e.currentTarget.querySelector('.ov') as HTMLElement).style.opacity = '1' }}
               onMouseOut={e  => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1)';   (e.currentTarget.querySelector('.ov') as HTMLElement).style.opacity = '0' }}>
            <img src={g.photo_url} alt={g.legende} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }} />
            <div className="ov" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 55%)', opacity: 0, transition: 'opacity .2s', display: 'flex', alignItems: 'flex-end', padding: 12 }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.8rem', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#fff', lineHeight: 1.3 }}>{g.legende}</span>
            </div>
          </div>
        ))}
      </div>
      {lb && <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb(null)} />}
    </div></div>
  )
}

// ── Export principal ─────────────────────────────────────────────────────────
interface Props {
  match: ProchainMatch | null
  classement: ClassementRow[]
  resultats: Resultat[]
  effectif: Joueur[]
  galerie: GaleriePhoto[]
}

export default function ClientSections({ match, classement, resultats, effectif, galerie }: Props) {
  return (
    <>
      <MatchSection match={match} />
      <ClassementSection rows={classement} />
      <ResultatsSection rows={resultats} />
      <EffectifSection joueurs={effectif} />
      <GalerieSection photos={galerie} />
    </>
  )
}
