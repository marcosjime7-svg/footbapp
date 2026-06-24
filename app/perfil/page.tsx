'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CATEGORIAS } from '../../utils/categorias'

const posiciones = ['Portero', 'Lateral derecho', 'Lateral izquierdo', 'Central', 'Pivote', 'Centrocampista', 'Mediapunta', 'Extremo derecho', 'Extremo izquierdo', 'Delantero']

export default function MiPerfil() {
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [nuevoVideo, setNuevoVideo] = useState('')
  const [videos, setVideos] = useState<any[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [progresoSubida, setProgresoSubida] = useState(0)
  const [subiendoAvatar, setSubiendoAvatar] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { router.push('/auth/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      setPerfil(data)

      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('jugador_id', userData.user.id)
        .order('created_at', { ascending: false })

      setVideos(videosData || [])
      setLoading(false)
    }
    init()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value })
  }

  const handleGuardar = async () => {
    setGuardando(true)
    await supabase
      .from('profiles')
      .update({
        nombre: perfil.nombre,
        club: perfil.club,
        categoria: perfil.categoria,
        posicion: perfil.posicion,
        edad: parseInt(perfil.edad) || null,
        altura: parseInt(perfil.altura) || null,
        temporadas: parseInt(perfil.temporadas) || null,
        descripcion: perfil.descripcion,
      })
      .eq('id', perfil.id)

    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2000)
  }

  const handleAnadirVideo = async () => {
    if (!nuevoVideo.trim()) return
    const { data } = await supabase
      .from('videos')
      .insert({ jugador_id: perfil.id, url: nuevoVideo, titulo: 'Vídeo' })
      .select()
      .single()

    if (data) {
      setVideos([data, ...videos])
      setNuevoVideo('')
    }
  }

  const handleBorrarVideo = async (id: string) => {
    await supabase.from('videos').delete().eq('id', id)
    setVideos(videos.filter(v => v.id !== id))
  }

  const handleSubirVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSubiendo(true)
    setProgresoSubida(0)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, tipo: 'video' }),
      })

      const { uploadUrl, publicUrl } = await res.json()

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      setProgresoSubida(100)

      const { data } = await supabase
        .from('videos')
        .insert({ jugador_id: perfil.id, url: publicUrl, titulo: file.name })
        .select()
        .single()

      if (data) setVideos([data, ...videos])
    } catch (err) {
      console.error(err)
    }

    setSubiendo(false)
    setProgresoSubida(0)
  }

  const handleSubirAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSubiendoAvatar(true)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, tipo: 'avatar' }),
      })

      const { uploadUrl, publicUrl } = await res.json()

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', perfil.id)

      setPerfil({ ...perfil, avatar_url: publicUrl })
    } catch (err) {
      console.error(err)
    }

    setSubiendoAvatar(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Cargando...</p></div>

  const iniciales = perfil?.nombre?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="text-gray-400 text-sm">←</button>
        <span className="text-sm font-medium text-gray-900">Mi perfil</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="relative shrink-0">
            {perfil?.avatar_url ? (
              <img src={perfil.avatar_url} alt={perfil.nombre} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-lg">
                {iniciales}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleSubirAvatar}
              className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
              id="avatar-upload"
              disabled={subiendoAvatar}
            />
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer text-white text-xs">
              {subiendoAvatar ? '...' : '+'}
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-900">{perfil?.nombre}</p>
            <p className="text-sm text-gray-400">{perfil?.rol} · {perfil?.categoria}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Datos personales</p>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
            <input name="nombre" value={perfil?.nombre || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Edad</label>
              <input name="edad" type="number" value={perfil?.edad || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Altura (cm)</label>
              <input name="altura" type="number" value={perfil?.altura || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Temporadas</label>
              <input name="temporadas" type="number" value={perfil?.temporadas || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Club y categoría</p>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Club actual</label>
            <input name="club" value={perfil?.club || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
            <select name="categoria" value={perfil?.categoria || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {perfil?.rol === 'jugador' && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Posición</label>
              <select name="posicion" value={perfil?.posicion || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                {posiciones.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Sobre mí</p>
          <textarea name="descripcion" value={perfil?.descripcion || ''} onChange={handleChange} rows={3} placeholder="Cuéntale a los scouts quién eres..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-none" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Vídeos</p>

          <div className="flex gap-2">
            <input
              value={nuevoVideo}
              onChange={(e) => setNuevoVideo(e.target.value)}
              placeholder="O pega un enlace de YouTube..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <button onClick={handleAnadirVideo} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm">+</button>
          </div>

          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleSubirVideo}
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="video-upload"
              disabled={subiendo}
            />
            <label htmlFor="video-upload" className={`flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg py-4 text-sm cursor-pointer hover:border-emerald-400 transition-colors ${subiendo ? 'opacity-50' : ''}`}>
              {subiendo ? (
                <span className="text-gray-400">Subiendo... {progresoSubida}%</span>
              ) : (
                <span className="text-gray-400">📱 Subir vídeo desde galería</span>
              )}
            </label>
          </div>

          {videos.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Aún no has añadido vídeos</p>}
          {videos.map(v => (
            <div key={v.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <p className="flex-1 text-xs text-gray-600 truncate">{v.url}</p>
              <button onClick={() => handleBorrarVideo(v.id)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>

        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {guardado ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </main>
  )
}