'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const links = [
    { href: '#classement', label: 'Classement' },
    { href: '#resultats',  label: 'Résultats'  },
    { href: '#effectif',   label: 'Effectif'   },
    { href: '#galerie',    label: 'Galerie'    },
  ]

  const linkColor = scrolled ? 'var(--soft)' : 'rgba(255,255,255,.7)'
  const linkHover = scrolled ? 'var(--black)' : '#fff'
  const iconColor = scrolled ? 'var(--black)' : '#fff'

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed',sans-serif",
    fontSize: '.78rem', fontWeight: 700,
    letterSpacing: '.14em', textTransform: 'uppercase',
    color: linkColor, textDecoration: 'none', transition: 'color .2s',
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(242,240,235,.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Nav gauche — desktop */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 28, flex: 1 }}>
            {links.slice(0, 2).map(l => (
              <a key={l.href} href={l.href} style={linkStyle}
                onMouseOver={e => (e.currentTarget.style.color = linkHover)}
                onMouseOut={e  => (e.currentTarget.style.color = linkColor)}>
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Logo */}
        <div style={{ flexShrink: 0, ...(isMobile ? {} : {}) }}>
          <Link href="/" style={{ display: 'block', lineHeight: 0 }}>
            <Image src="/logo.png" alt="CDS" width={40} height={52} style={{ height: 36, width: 'auto', display: 'block' }} priority />
          </Link>
        </div>

        {/* Nav droite — desktop */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 28, flex: 1, justifyContent: 'flex-end' }}>
            {links.slice(2).map(l => (
              <a key={l.href} href={l.href} style={linkStyle}
                onMouseOver={e => (e.currentTarget.style.color = linkHover)}
                onMouseOut={e  => (e.currentTarget.style.color = linkColor)}>
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Burger — mobile */}
        {isMobile && (
          <button onClick={() => setOpen(o => !o)} aria-label="Menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: 6, marginLeft: 'auto' }}>
            {open
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            }
          </button>
        )}
      </div>

      {/* Menu mobile */}
      {isMobile && open && (
        <div style={{ background: 'rgba(242,240,235,.98)', borderTop: '1px solid var(--border)', padding: '8px 20px 16px' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: 'block', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--black)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
