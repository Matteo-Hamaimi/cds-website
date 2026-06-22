'use client'
import { useEffect, useState } from 'react'

function pad(n: number) { return String(n).padStart(2, '0') }

export default function Countdown({ dateIso }: { dateIso: string }) {
  const [vals, setVals] = useState({ j: '--', h: '--', m: '--' })

  useEffect(() => {
    function tick() {
      const diff = new Date(dateIso).getTime() - Date.now()
      if (diff <= 0) { setVals({ j: '00', h: '00', m: '00' }); return }
      const min = Math.floor(diff / 60000)
      setVals({ j: pad(Math.floor(min / 1440)), h: pad(Math.floor((min % 1440) / 60)), m: pad(min % 60) })
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [dateIso])

  const Unit = ({ val, label }: { val: string; label: string }) => (
    <div style={{ textAlign: 'center', minWidth: 62 }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '3rem', fontWeight: 900, color: 'var(--black)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{val}</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '.58rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--soft)', marginTop: 4 }}>{label}</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <Unit val={vals.j} label="Jours" />
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.2rem', color: 'var(--border)', lineHeight: 1, padding: '0 2px', marginTop: 4 }}>:</div>
      <Unit val={vals.h} label="Heures" />
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.2rem', color: 'var(--border)', lineHeight: 1, padding: '0 2px', marginTop: 4 }}>:</div>
      <Unit val={vals.m} label="Min" />
    </div>
  )
}
