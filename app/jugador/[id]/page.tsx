'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import VideoPlayer from '../../components/VideoPlayer'

export default function PerfilJugador() {
  const [jugador, setJugador] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [escudoClub, setEscudoClub] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchJugador = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { router.push('/auth/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single()

      setJugador(data)

      if (data?.club) {
        const { data: clubData } = await supabase
          .from('clubs')
          .select('escudo_url')
          .eq('nombre', data.club)
          .single()
        if (clubData?.escudo_url) setEscudoClub(clubData.escudo_url)
      }

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

  // Fix altura: si es menor de 100 probablemente metió mal el dato
  const alturaDisplay = jugador.altura && jugador.altura >= 100 ? `${jugador.altura}cm` : '—'

  const stats = [
    { val: jugador.edad ?? '—', lbl: 'Edad' },
    { val: alturaDisplay, lbl: 'Altura' },
    { val: jugador.temporadas || '—', lbl: 'Temporadas' },
    {
      val: jugador.verificado
        ? <span className="text-emerald-600 text-xl">✓</span>
        : '—',
      lbl: 'Verificado'
    },
  ]

  const statsTemporada = [
    { val: jugador.partidos ?? '—', lbl: 'Partidos' },
    { val: jugador.minutos ?? '—', lbl: 'Minutos' },
    { val: jugador.goles ?? '—', lbl: 'Goles' },
    { val: jugador.asistencias ?? '—', lbl: 'Asistencias' },
  ]

  const tieneStats = jugador.partidos || jugador.minutos || jugador.goles || jugador.asistencias

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
        <div className="flex items-center gap-2">
          <h1 className="text-white text-xl font-semibold">{jugador.nombre}</h1>
          {jugador.verificado && (
            <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              ✓ Verificado
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {escudoClub && (
            <img
              src={escudoClub}
              alt={jugador.club}
              className="w-5 h-5 rounded-full object-contain bg-white p-0.5"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <p className="text-emerald-200 text-sm">{jugador.posicion} · {jugador.club} · {jugador.categoria}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">

        {/* Stats perfil */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {stats.map((s) => (
            <div key={s.lbl} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
              <span className="block text-lg font-semibold text-gray-900">{s.val}</span>
              <span className="text-xs text-gray-400">{s.lbl}</span>
            </div>
          ))}
        </div>

        {/* Stats temporada */}
        {tieneStats && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <p className="text-xs text-gray-400 mb-3">Temporada actual</p>
            <div className="grid grid-cols-4 gap-2">
              {statsTemporada.map((s) => (
                <div key={s.lbl} className="text-center">
                  <span className="block text-lg font-semibold text-gray-900">{s.val}</span>
                  <span className="text-xs text-gray-400">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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