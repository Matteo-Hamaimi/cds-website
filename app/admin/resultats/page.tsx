'use client'
import { useEffect, useState } from 'react'
import { supabase, type Resultat } from '@/lib/supabase'

const inp: React.CSSProperties = { padding: '7px 10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 3, color: '#f5f5f5', fontSize: '.85rem', fontFamily: 'inherit' }
const btn = (primary?: boolean): React.CSSProperties => ({ padding: '8px 18px', background: primary ? '#f2f0eb' : 'transparent', color: primary ? '#0a0a0a' : '#555', border: primary ? 'none' : '1px solid #333', borderRadius: 3, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' })

const empty = { date_iso: '', domicile: 'CDS', exterieur: '', score_dom: 0, score_ext: 0 }

export default function AdminResultats() {
  const [rows, setRows] = useState<Resultat[]>([])
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('resultats').select('*').order('date_iso', { ascending: false })
    setRows(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    await supabase.from('resultats').insert(form)
    setForm(empty); setSaving(false); load()
  }

  async function del(id: number) {
    if (!confirm('Supprimer ce résultat ?')) return
    await supabase.from('resultats').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 32 }}>Résultats</h1>

      {/* Formulaire ajout */}
      <form onSubmit={add} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '24px', marginBottom: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '.68rem', color: '#444', display: 'block', marginBottom: 4, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>Date</label>
          <input type="date" required value={form.date_iso} onChange={e => setForm(f => ({ ...f, date_iso: e.target.value }))} style={inp} />
        </div>
        <div>
          <label style={{ fontSize: '.68rem', color: '#444', display: 'block', marginBottom: 4, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>Domicile</label>
          <input type="text" required value={form.domicile} onChange={e => setForm(f => ({ ...f, domicile: e.target.value }))} style={inp} />
        </div>
        <div>
          <label style={{ fontSize: '.68rem', color: '#444', display: 'block', marginBottom: 4, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>Score dom.</label>
          <input type="number" min={0} required value={form.score_dom} onChange={e => setForm(f => ({ ...f, score_dom: +e.target.value }))} style={{ ...inp, width: 70 }} />
        </div>
        <div>
          <label style={{ fontSize: '.68rem', color: '#444', display: 'block', marginBottom: 4, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>Score ext.</label>
          <input type="number" min={0} required value={form.score_ext} onChange={e => setForm(f => ({ ...f, score_ext: +e.target.value }))} style={{ ...inp, width: 70 }} />
        </div>
        <div>
          <label style={{ fontSize: '.68rem', color: '#444', display: 'block', marginBottom: 4, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>Extérieur</label>
          <input type="text" required value={form.exterieur} onChange={e => setForm(f => ({ ...f, exterieur: e.target.value }))} style={inp} />
        </div>
        <button type="submit" disabled={saving} style={btn(true)}>{saving ? '…' : '+ Ajouter'}</button>
      </form>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(r => {
          const isDom = r.domicile === 'CDS'
          const isExt = r.exterieur === 'CDS'
          let res = 'N'
          if (isDom) res = r.score_dom > r.score_ext ? 'V' : r.score_dom < r.score_ext ? 'D' : 'N'
          if (isExt) res = r.score_ext > r.score_dom ? 'V' : r.score_ext < r.score_dom ? 'D' : 'N'
          const col = { V: '#4ade80', N: '#888', D: '#f87171' }[res]!
          return (
            <div key={r.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <span style={{ fontSize: '.75rem', color: '#444', minWidth: 100 }}>{fmtDate(r.date_iso)}</span>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: isDom ? 700 : 400, color: isDom ? '#f5f5f5' : '#555', textTransform: 'uppercase', fontSize: '.9rem' }}>{r.domicile}</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, color: '#f5f5f5', fontSize: '1.2rem', background: '#1a1a1a', padding: '2px 10px', borderRadius: 2 }}>{r.score_dom}–{r.score_ext}</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: isExt ? 700 : 400, color: isExt ? '#f5f5f5' : '#555', textTransform: 'uppercase', fontSize: '.9rem', textAlign: 'right' }}>{r.exterieur}</span>
              </div>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.68rem', fontWeight: 700, color: col, letterSpacing: '.08em', minWidth: 56, textAlign: 'right' }}>{{ V: 'Victoire', N: 'Nul', D: 'Défaite' }[res]}</span>
              <button onClick={() => del(r.id)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
