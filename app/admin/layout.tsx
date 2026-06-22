'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/admin',            label: 'Dashboard'     },
  { href: '/admin/match',      label: 'Match'         },
  { href: '/admin/classement', label: 'Classement'    },
  { href: '/admin/resultats',  label: 'Résultats'     },
  { href: '/admin/effectif',   label: 'Effectif'      },
  { href: '/admin/galerie',    label: 'Galerie'       },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path = usePathname()
  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && path !== '/admin/login') router.replace('/admin/login')
      else setReady(true)
    })
  }, [path, router])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (path === '/admin/login') return <>{children}</>
  if (!ready) return <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: 'block',
    padding: isMobile ? '12px 16px' : '9px 12px',
    borderRadius: 4,
    fontFamily: "'Barlow Condensed',sans-serif",
    fontSize: isMobile ? '1.1rem' : '.8rem',
    fontWeight: 700,
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: active ? '#f5f5f5' : '#555',
    background: active ? '#1a1a1a' : 'transparent',
    borderBottom: isMobile ? '1px solid #1a1a1a' : 'none',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>

      {/* MOBILE — topbar */}
      {isMobile ? (
        <>
          <div style={{ background: '#0f0f0f', borderBottom: '1px solid #1a1a1a', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.1rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '.06em' }}>CDS Admin</p>
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f5f5f5', padding: 4 }}>
              {menuOpen
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
              }
            </button>
          </div>
          {menuOpen && (
            <div style={{ background: '#0f0f0f', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 52, zIndex: 49 }}>
              {navItems.map(n => (
                <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={linkStyle(path === n.href)}>{n.label}</Link>
              ))}
              <button onClick={logout} style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderTop: '1px solid #222', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#555', cursor: 'pointer', textAlign: 'left' }}>
                Déconnexion
              </button>
            </div>
          )}
        </>
      ) : (
        /* DESKTOP — sidebar */
        <aside style={{ width: 220, background: '#0f0f0f', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', padding: '28px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
          <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #1a1a1a' }}>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>CDS Football</p>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '.04em' }}>Admin</p>
          </div>
          <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(n => (
              <Link key={n.href} href={n.href} style={linkStyle(path === n.href)}>{n.label}</Link>
            ))}
          </nav>
          <div style={{ padding: '16px 12px', borderTop: '1px solid #1a1a1a' }}>
            <button onClick={logout} style={{ width: '100%', padding: '9px 12px', background: 'none', border: '1px solid #222', borderRadius: 4, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#555', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </aside>
      )}

      {/* Main */}
      <main style={{ flex: 1, padding: isMobile ? '24px 16px' : '40px 48px', color: '#d1d1d1', overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
