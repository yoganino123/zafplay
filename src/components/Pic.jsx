import { useState } from 'react'

// Gambar dari public/assets; jika file belum ada, tampilkan emoji pengganti.
export default function Pic({ name, fallback = '🎮', className = '', alt = '' }) {
  const [broken, setBroken] = useState(false)
  if (broken) return <span className={`pic-fallback ${className}`}>{fallback}</span>
  return (
    <img
      className={`pic ${className}`}
      src={`${import.meta.env.BASE_URL}assets/${name}`}
      alt={alt}
      onError={() => setBroken(true)}
      draggable={false}
    />
  )
}
