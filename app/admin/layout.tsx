'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/admin',            label: 'Dashboard'     },
  { href: '/admin/match',      label: 'Prochain match' },
  { href: '/admin/classement', label: 'Classement'    },
  { href: '/admin/resultats',  label: 'Résultats'     },
  { href: '/admin/effectif',   label: 'Effectif'      },
  { href: '/admin/galerie',    label: 'Galerie'       },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && path !== '/admin/login') router.replace('/admin/login')
      else setReady(true)
    })
  }, [path, router])

  if (path === '/admin/login') return <>{children}</>
  if (!ready) return <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#0f0f0f', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', padding: '28px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #1a1a1a' }}>
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>CDS Football</p>
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '.04em' }}>Admin</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(n => (
            <Link key={n.href} href={n.href} style={{ display: 'block', padding: '9px 12px', borderRadius: 4, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.8rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', color: path === n.href ? '#f5f5f5' : '#555', background: path === n.href ? '#1a1a1a' : 'transparent', transition: 'color .12s' }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1a1a1a' }}>
          <button onClick={logout} style={{ width: '100%', padding: '9px 12px', background: 'none', border: '1px solid #222', borderRadius: 4, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#555', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '40px 48px', color: '#d1d1d1', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
