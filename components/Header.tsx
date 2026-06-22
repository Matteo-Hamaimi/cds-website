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

  const linkColor = scrolled ? 'var(--soft)' : 'rgba(255,255,255,.6)'
  const linkHover = scrolled ? 'var(--black)' : '#fff'

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(242,240,235,.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'background .3s',
      }}
    >
      {/* Barre principale */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Nav gauche — desktop uniquement */}
        <nav className="hidden md:flex" style={{ display: 'flex', gap: 28, flex: 1 }}>
          {links.slice(0, 2).map(l => (
            <a key={l.href} href={l.href}
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.8rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: linkColor, textDecoration: 'none', transition: 'color .2s' }}
              onMouseOver={e => (e.currentTarget.style.color = linkHover)}
              onMouseOut={e  => (e.currentTarget.style.color = linkColor)}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Logo — toujours visible, centré sur desktop, gauche sur mobile */}
        <div style={{ flexShrink: 0 }}>
          <Link href="/" style={{ display: 'block', lineHeight: 0 }}>
            <Image src="/logo.png" alt="CDS" width={40} height={52} style={{ height: 36, width: 'auto', display: 'block' }} priority />
          </Link>
        </div>

        {/* Nav droite — desktop uniquement */}
        <nav className="hidden md:flex" style={{ display: 'flex', gap: 28, flex: 1, justifyContent: 'flex-end' }}>
          {links.slice(2).map(l => (
            <a key={l.href} href={l.href}
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.8rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: linkColor, textDecoration: 'none', transition: 'color .2s' }}
              onMouseOver={e => (e.currentTarget.style.color = linkHover)}
              onMouseOut={e  => (e.currentTarget.style.color = linkColor)}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Burger — mobile uniquement */}
        <button
          className="md:hidden"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? 'var(--black)' : '#fff', padding: 6, marginLeft: 12 }}
        >
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
          }
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {open && (
        <div style={{ background: 'rgba(242,240,235,.98)', borderTop: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.4rem', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--black)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
