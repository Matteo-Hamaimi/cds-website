'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/admin')
  }

  const input: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #222', borderRadius: 4, color: '#f5f5f5', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#555', marginBottom: 8, textAlign: 'center' }}>CDS Football</p>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.5rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', textAlign: 'center', marginBottom: 40 }}>Admin</h1>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={input} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={input} />
          {error && <p style={{ fontSize: '.8rem', color: '#f87171' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: '12px 0', background: '#f2f0eb', color: '#0a0a0a', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.9rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 8 }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
