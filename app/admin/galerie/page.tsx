'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, type GaleriePhoto } from '@/lib/supabase'

const btn = (primary?: boolean): React.CSSProperties => ({ padding: '8px 18px', background: primary ? '#f2f0eb' : 'transparent', color: primary ? '#0a0a0a' : '#555', border: primary ? 'none' : '1px solid #333', borderRadius: 3, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' })
const inp: React.CSSProperties = { padding: '7px 10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 3, color: '#f5f5f5', fontSize: '.85rem', fontFamily: 'inherit', width: '100%' }

export default function AdminGalerie() {
  const [photos, setPhotos] = useState<GaleriePhoto[]>([])
  const [legende, setLegende] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('galerie').select('*').order('created_at', { ascending: false })
    setPhotos(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []); if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const path = `galerie/${Date.now()}-${file.name}`
      await supabase.storage.from('cds-photos').upload(path, file)
      const { data } = supabase.storage.from('cds-photos').getPublicUrl(path)
      await supabase.from('galerie').insert({ photo_url: data.publicUrl, legende: legende || file.name.replace(/\.[^.]+$/, '') })
    }
    setLegende(''); setUploading(false); load()
  }

  async function del(photo: GaleriePhoto) {
    if (!confirm('Supprimer cette photo ?')) return
    const path = photo.photo_url.split('cds-photos/')[1]
    if (path) await supabase.storage.from('cds-photos').remove([path])
    await supabase.from('galerie').delete().eq('id', photo.id)
    setPhotos(p => p.filter(x => x.id !== photo.id))
  }

  async function updateLegende(id: number, val: string) {
    await supabase.from('galerie').update({ legende: val }).eq('id', id)
    setPhotos(p => p.map(x => x.id === id ? { ...x, legende: val } : x))
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.2rem', fontWeight: 900, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 32 }}>Galerie</h1>

      {/* Upload */}
      <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: 24, marginBottom: 32 }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1rem', fontWeight: 800, color: '#f5f5f5', textTransform: 'uppercase', marginBottom: 16 }}>Ajouter des photos</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: '.65rem', color: '#444', display: 'block', marginBottom: 4, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>Légende (optionnel)</label>
            <input type="text" value={legende} onChange={e => setLegende(e.target.value)} placeholder="Ex : Match vs Belleville" style={inp} />
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={btn(true)}>{uploading ? 'Upload en cours…' : 'Choisir des photos'}</button>
        </div>
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
        {photos.map(p => (
          <div key={p.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
              <img src={p.photo_url} alt={p.legende} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: '10px 12px' }}>
              <input type="text" value={p.legende} onChange={e => setPhotos(ps => ps.map(x => x.id === p.id ? { ...x, legende: e.target.value } : x))}
                     onBlur={e => updateLegende(p.id, e.target.value)}
                     style={{ ...inp, fontSize: '.75rem', marginBottom: 8 }} />
              <button onClick={() => del(p)} style={btn()}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
