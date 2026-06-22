'use client'
import { useEffect, useState } from 'react'
import { supabase, type ProchainMatch } from '@/lib/supabase'

const inp: React.CSSProperties = { padding: '9px 12px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 3, color: '#f5f5f5', fontSize: '.9rem', fontFamily: 'inherit', width: '100%' }

export default function AdminMatch() {
  const [form, setForm] = useState({ date_iso: '', adversaire: '', lieu: '', domicile: true })
  const [id, setId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('prochain_match').select('*').order('id', { ascending: false }).limit(1).single().then(({ data }) => {
      if (data) {
        setId(data.id)
        const dt = new Date(data.date_iso)
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        setForm({ date_iso: local, adversaire: data.adversaire, lieu: data.lieu, domicile: data.domicile })
      }
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const payload = { ...form, date_iso: new Date(form.date_iso).toISOString() }
    if (id) await supabase.from('prochain_match').update(payload).eq('id', id)
    else await supabase.from('prochain_match').insert(payload)
    setSaving(false); alert('Match mis à jour ✓')
  }

  const Label = ({ children }: { children: string }) => (
    <label style={{ fontSize: '.68rem', color: '#444', display: 'block', marginBottom: 6, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.12em', textTransform: 'uppercase' }}>{children}</label>
  )

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 32 }}>Prochain match</h1>
      <form onSubmit={save} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: 28, maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div><Label>Date et heure</Label><input type="datetime-local" required value={form.date_iso} onChange={e => setForm(f => ({ ...f, date_iso: e.target.value }))} style={inp} /></div>
        <div><Label>Adversaire</Label><input type="text" required value={form.adversaire} onChange={e => setForm(f => ({ ...f, adversaire: e.target.value }))} style={inp} /></div>
        <div><Label>Lieu</Label><input type="text" required value={form.lieu} onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))} style={inp} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="dom" checked={form.domicile} onChange={e => setForm(f => ({ ...f, domicile: e.target.checked }))} />
          <label htmlFor="dom" style={{ fontSize: '.85rem', color: '#888', cursor: 'pointer' }}>Domicile</label>
        </div>
        <button type="submit" disabled={saving} style={{ padding: '12px 0', background: '#f2f0eb', color: '#0a0a0a', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.9rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {saving ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
      </form>
    </div>
  )
}
