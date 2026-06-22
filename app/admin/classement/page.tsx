'use client'
import { useEffect, useState } from 'react'
import { supabase, type ClassementRow } from '@/lib/supabase'

const inp: React.CSSProperties = { padding: '7px 10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 3, color: '#f5f5f5', fontSize: '.85rem', fontFamily: 'inherit', width: '100%' }
const btn = (primary?: boolean): React.CSSProperties => ({ padding: '8px 18px', background: primary ? '#f2f0eb' : 'transparent', color: primary ? '#0a0a0a' : '#555', border: primary ? 'none' : '1px solid #333', borderRadius: 3, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' })

export default function AdminClassement() {
  const [rows, setRows] = useState<ClassementRow[]>([])
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('classement').select('*').order('position')
    setRows(data ?? [])
  }
  useEffect(() => { load() }, [])

  function update(id: number, field: keyof ClassementRow, value: string | number | boolean) {
    setRows(r => r.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  async function save() {
    setSaving(true)
    for (const row of rows) {
      await supabase.from('classement').update({ position: row.position, equipe: row.equipe, pts: row.pts, j: row.j, g: row.g, n: row.n, p: row.p, diff: row.diff, is_cds: row.is_cds }).eq('id', row.id)
    }
    setSaving(false)
    alert('Classement sauvegardé ✓')
  }

  async function addRow() {
    const { data } = await supabase.from('classement').insert({ position: rows.length + 1, equipe: 'Nouvelle équipe', pts: 0, j: 0, g: 0, n: 0, p: 0, diff: 0, is_cds: false }).select().single()
    if (data) setRows(r => [...r, data])
  }

  async function deleteRow(id: number) {
    if (!confirm('Supprimer cette ligne ?')) return
    await supabase.from('classement').delete().eq('id', id)
    setRows(r => r.filter(row => row.id !== id))
  }

  const th: React.CSSProperties = { padding: '8px 10px', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#444', textAlign: 'center', borderBottom: '1px solid #1a1a1a' }

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 32 }}>Classement</h1>
      <div style={{ overflowX: 'auto', border: '1px solid #1a1a1a', borderRadius: 6, marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem' }}>
          <thead><tr style={{ background: '#111' }}>
            <th style={{ ...th, width: 50 }}>#</th>
            <th style={{ ...th, textAlign: 'left', minWidth: 180 }}>Équipe</th>
            <th style={th}>Pts</th><th style={th}>J</th><th style={th}>G</th>
            <th style={th}>N</th><th style={th}>P</th><th style={th}>Diff</th>
            <th style={th}>CDS?</th><th style={th}></th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #141414' }}>
                {(['position','pts','j','g','n','p'] as const).includes('position') && (
                  <td style={{ padding: '6px 8px' }}>
                    <input type="number" value={r.position} onChange={e => update(r.id, 'position', +e.target.value)} style={{ ...inp, width: 52 }} />
                  </td>
                )}
                <td style={{ padding: '6px 8px' }}>
                  <input type="text" value={r.equipe} onChange={e => update(r.id, 'equipe', e.target.value)} style={inp} />
                </td>
                {(['pts','j','g','n','p'] as const).map(f => (
                  <td key={f} style={{ padding: '6px 8px' }}>
                    <input type="number" value={r[f]} onChange={e => update(r.id, f, +e.target.value)} style={{ ...inp, width: 56 }} />
                  </td>
                ))}
                <td style={{ padding: '6px 8px' }}>
                  <input type="number" value={r.diff} onChange={e => update(r.id, 'diff', +e.target.value)} style={{ ...inp, width: 64 }} />
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                  <input type="checkbox" checked={r.is_cds} onChange={e => update(r.id, 'is_cds', e.target.checked)} />
                </td>
                <td style={{ padding: '6px 8px' }}>
                  <button onClick={() => deleteRow(r.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={save} disabled={saving} style={btn(true)}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</button>
        <button onClick={addRow} style={btn()}>+ Ajouter équipe</button>
      </div>
    </div>
  )
}
