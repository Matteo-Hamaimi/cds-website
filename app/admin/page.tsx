'use client'
import Link from 'next/link'

const cards = [
  { href: '/admin/match',      label: 'Prochain match', desc: 'Date, adversaire, lieu' },
  { href: '/admin/classement', label: 'Classement',     desc: 'Mettre à jour les points' },
  { href: '/admin/resultats',  label: 'Résultats',      desc: 'Ajouter un score' },
  { href: '/admin/effectif',   label: 'Effectif',       desc: 'Joueurs, stats, photos' },
  { href: '/admin/galerie',    label: 'Galerie',        desc: 'Uploader des photos' },
]

export default function AdminDashboard() {
  return (
    <div>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#444', marginBottom: 8 }}>Bienvenue</p>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.8rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 40 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
        {cards.map(c => (
          <Link key={c.href} href={c.href}
            style={{ display: 'block', padding: '24px 20px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, textDecoration: 'none' }}>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.1rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 6 }}>{c.label}</p>
            <p style={{ fontSize: '.78rem', color: '#555' }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
