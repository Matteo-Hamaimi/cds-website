'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/admin',            label: 'Dashboard'  },
  { href: '/admin/match',      label: 'Match'      },
  { href: '/admin/classement', label: 'Classement' },
  { href: '/admin/resultats',  label: 'Résultats'  },
  { href: '/admin/effectif',   label: 'Effectif'   },
  { href: '/admin/galerie',    label: 'Galerie'    },
]

const F: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif" }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const path     = usePathname()
  const [ready, setReady]   = useState(false)
  const [open, setOpen]     = useState(false)

  useEffect(() => {
    // Supabase gère le refresh du token automatiquement
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && path !== '/admin/login') router.replace('/admin/login')
      else setReady(true)
    })
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && path !== '/admin/login') router.replace('/admin/login')
      else setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [path, router])

  if (path === '/admin/login') return <>{children}</>
  if (!ready) return <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    ...F, display: 'block', padding: '11px 16px',
    fontSize: '1rem', fontWeight: 700, letterSpacing: '.1em',
    textTransform: 'uppercase', textDecoration: 'none',
    color: active ? '#f5f5f5' : '#555',
    background: active ? '#1a1a1a' : 'transparent',
    borderBottom: '1px solid #1a1a1a',
  })

  const sidebarLinkStyle = (active: boolean): React.CSSProperties => ({
    ...F, display: 'block', padding: '9px 12px', borderRadius: 4,
    fontSize: '.8rem', fontWeight: 700, letterSpacing: '.1em',
    textTransform: 'uppercase', textDecoration: 'none',
    color: active ? '#f5f5f5' : '#555',
    background: active ? '#1a1a1a' : 'transparent',
  })

  return (
    <div className="admin-wrap">

      {/* TOPBAR mobile */}
      <div className="admin-topbar">
        <p style={{ ...F, fontSize: '1.1rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase' }}>CDS Admin</p>
        <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f5f5f5', padding: 4 }}>
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
          }
        </button>
      </div>

      {/* MENU mobile déroulant */}
      {open && (
        <div className="admin-menu">
          {navItems.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={linkStyle(path === n.href)}>{n.label}</Link>
          ))}
          <button onClick={logout} style={{ ...F, display: 'block', width: '100%', padding: '11px 16px', background: 'none', border: 'none', borderTop: '1px solid #333', fontSize: '1rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#555', cursor: 'pointer', textAlign: 'left' }}>
            Déconnexion
          </button>
        </div>
      )}

      {/* SIDEBAR desktop */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #1a1a1a' }}>
          <p style={{ ...F, fontSize: '.62rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>CDS Football</p>
          <p style={{ ...F, fontSize: '1.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase' }}>Admin</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(n => (
            <Link key={n.href} href={n.href} style={sidebarLinkStyle(path === n.href)}>{n.label}</Link>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1a1a1a' }}>
          <button onClick={logout} style={{ width: '100%', padding: '9px 12px', background: 'none', border: '1px solid #222', borderRadius: 4, ...F, fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#555', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">{children}</main>
    </div>
  )
}
