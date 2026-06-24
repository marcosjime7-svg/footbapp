'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import VideoPlayer from '../../components/VideoPlayer'

export default function PerfilJugador() {
  const [jugador, setJugador] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchJugador = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single()

      setJugador(data)

      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('jugador_id', params.id)
        .order('created_at', { ascending: false })

      setVideos(videosData || [])
      setLoading(false)
    }

    fetchJugador()
  }, [params.id])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Cargando...</p></div>
  if (!jugador) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Jugador no encontrado</p></div>

  const iniciales = jugador.nombre?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-emerald-700 px-4 pt-4 pb-6">
        <button onClick={() => router.back()} className="text-emerald-200 text-sm mb-4 flex items-center gap-1">
          ← Volver
        </button>
        {jugador.avatar_url ? (
  <img src={jugador.avatar_url} alt={jugador.nombre} className="w-14 h-14 rounded-full object-cover mb-3" />
) : (
  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-lg mb-3">
    {iniciales}
  </div>
)}
        <h1 className="text-white text-xl font-semibold">{jugador.nombre}</h1>
        <p className="text-emerald-200 text-sm">{jugador.posicion} · {jugador.club} · {jugador.categoria}</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { val: jugador.edad, lbl: 'Edad' },
            { val: jugador.altura ? `${jugador.altura}cm` : '—', lbl: 'Altura' },
            { val: jugador.temporadas || '—', lbl: 'Temporadas' },
            { val: jugador.verificado ? '✓' : '—', lbl: 'Verificado' },
          ].map((s) => (
            <div key={s.lbl} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
              <span className="block text-lg font-semibold text-gray-900">{s.val}</span>
              <span className="text-xs text-gray-400">{s.lbl}</span>
            </div>
          ))}
        </div>

        {jugador.descripcion && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <p className="text-xs text-gray-400 mb-1">Sobre mí</p>
            <p className="text-sm text-gray-700">{jugador.descripcion}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <p className="text-xs text-gray-400 mb-3">Vídeos</p>
          {videos.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Este jugador aún no ha subido vídeos</p>}
          <div className="flex flex-col gap-4">
            {videos.map((v) => (
              <VideoPlayer key={v.id} url={v.url} />
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push(`/mensajes/nuevo?para=${jugador.id}`)}
          className="w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium"
        >
          Contactar jugador ↗
        </button>
      </div>
    </main>
  )
}