'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, type Joueur, type Poste } from '@/lib/supabase'

const postes: Poste[] = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant']
const inp: React.CSSProperties = { padding: '7px 10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 3, color: '#f5f5f5', fontSize: '.85rem', fontFamily: 'inherit', width: '100%' }
const btn = (primary?: boolean): React.CSSProperties => ({ padding: '8px 18px', background: primary ? '#f2f0eb' : 'transparent', color: primary ? '#0a0a0a' : '#555', border: primary ? 'none' : '1px solid #333', borderRadius: 3, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' })

const emptyJoueur = { nom: '', surnom: '', numero: 1, poste: 'Milieu' as Poste, photo_url: '', buts: 0, passes: 0, actif: true }

export default function AdminEffectif() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([])
  const [editing, setEditing] = useState<Joueur | null>(null)
  const [form, setForm] = useState(emptyJoueur)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('effectif').select('*').order('numero')
    setJoueurs(data ?? [])
  }
  useEffect(() => { load() }, [])

  function startEdit(j: Joueur) { setEditing(j); setForm({ nom: j.nom, surnom: j.surnom, numero: j.numero, poste: j.poste, photo_url: j.photo_url, buts: j.buts, passes: j.passes, actif: j.actif }) }
  function cancelEdit() { setEditing(null); setForm(emptyJoueur) }

  async function uploadPhoto(file: File): Promise<string> {
    const path = `effectif/${Date.now()}-${file.name}`
    await supabase.storage.from('cds-photos').upload(path, file)
    const { data } = supabase.storage.from('cds-photos').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const url = await uploadPhoto(file)
    setForm(f => ({ ...f, photo_url: url }))
    setUploading(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await supabase.from('effectif').update(form).eq('id', editing.id)
    } else {
      await supabase.from('effectif').insert(form)
    }
    cancelEdit(); load()
  }

  async function del(id: number) {
    if (!confirm('Supprimer ce joueur ?')) return
    await supabase.from('effectif').delete().eq('id', id)
    setJoueurs(j => j.filter(x => x.id !== id))
  }

  const Label = ({ children }: { children: string }) => (
    <label style={{ fontSize: '.65rem', color: '#444', display: 'block', marginBottom: 4, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>{children}</label>
  )

  return (
    <div style={{ maxWidth: '100%' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 32 }}>Effectif</h1>

      {/* Formulaire */}
      <form onSubmit={save} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: 24, marginBottom: 32 }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1rem', fontWeight: 800, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 20 }}>{editing ? 'Modifier le joueur' : 'Ajouter un joueur'}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 16 }}>
          <div><Label>Surnom</Label><input type="text" required value={form.surnom} onChange={e => setForm(f => ({ ...f, surnom: e.target.value }))} style={inp} /></div>
          <div><Label>Nom</Label><input type="text" required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} style={inp} /></div>
          <div><Label>Numéro</Label><input type="number" min={1} required value={form.numero} onChange={e => setForm(f => ({ ...f, numero: +e.target.value }))} style={inp} /></div>
          <div><Label>Poste</Label>
            <select value={form.poste} onChange={e => setForm(f => ({ ...f, poste: e.target.value as Poste }))} style={{ ...inp }}>
              {postes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div><Label>Buts</Label><input type="number" min={0} value={form.buts} onChange={e => setForm(f => ({ ...f, buts: +e.target.value }))} style={inp} /></div>
          <div><Label>Passes</Label><input type="number" min={0} value={form.passes} onChange={e => setForm(f => ({ ...f, passes: +e.target.value }))} style={inp} /></div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>Photo</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {form.photo_url && <img src={form.photo_url} alt="preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            <button type="button" onClick={() => fileRef.current?.click()} style={btn()}>{uploading ? 'Upload…' : 'Choisir une photo'}</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" style={btn(true)}>{editing ? 'Modifier' : 'Ajouter'}</button>
          {editing && <button type="button" onClick={cancelEdit} style={btn()}>Annuler</button>}
        </div>
      </form>

      {/* Liste */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
        {joueurs.map(j => (
          <div key={j.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #222', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '.8rem', color: '#555' }}>
                {j.photo_url ? <img src={j.photo_url} alt={j.surnom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (j.surnom[0] + j.nom[0]).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.06em', color: '#444' }}>#{j.numero}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.95rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase' }}>{j.surnom}</div>
                <div style={{ fontSize: '.72rem', color: '#555' }}>{j.nom} · {j.poste}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(j)} style={btn(true)}>Modifier</button>
              <button onClick={() => del(j.id)} style={btn()}>Suppr.</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
