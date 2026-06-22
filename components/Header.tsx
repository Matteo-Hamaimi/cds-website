'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#classement', label: 'Classement' },
    { href: '#resultats',  label: 'Résultats'  },
    { href: '#effectif',   label: 'Effectif'   },
    { href: '#galerie',    label: 'Galerie'    },
  ]

  const onHero = !scrolled
  const linkColor = onHero ? 'rgba(255,255,255,.6)' : 'var(--soft)'
  const linkHover = onHero ? '#fff' : 'var(--black)'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(242,240,235,.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'background .3s, border-color .3s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <nav style={{ display: 'flex', gap: 28, flex: 1 }} className="hidden md:flex">
          {links.slice(0,2).map(l => (
            <a key={l.href} href={l.href} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.8rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: linkColor, textDecoration: 'none', transition: 'color .2s' }}
               onMouseOver={e => (e.currentTarget.style.color = linkHover)}
               onMouseOut={e  => (e.currentTarget.style.color = linkColor)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ flexShrink: 0 }}>
          <Link href="/">
            <Image src="/logo.png" alt="CDS" width={40} height={52} style={{ height: 40, width: 'auto', display: 'block' }} priority />
          </Link>
        </div>

        <nav style={{ display: 'flex', gap: 28, flex: 1, justifyContent: 'flex-end' }} className="hidden md:flex">
          {links.slice(2).map(l => (
            <a key={l.href} href={l.href} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.8rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: linkColor, textDecoration: 'none', transition: 'color .2s' }}
               onMouseOver={e => (e.currentTarget.style.color = linkHover)}
               onMouseOut={e  => (e.currentTarget.style.color = linkColor)}>
              {l.label}
            </a>
          ))}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: linkColor, padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
          </svg>
        </button>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 32px 20px', display: 'flex', flexDirection: 'column', gap: 14, background: 'rgba(242,240,235,.97)' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
               style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--soft)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
