'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CATEGORIAS_AFICIONADO, CATEGORIAS_JUVENIL } from '../utils/categorias'

const POSICIONES = ['Portero', 'Lateral derecho', 'Lateral izquierdo', 'Central', 'Pivote', 'Centrocampista', 'Mediapunta', 'Extremo derecho', 'Extremo izquierdo', 'Delantero']

function MensajesBadge({ userId }: { userId: string }) {
  const [count, setCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchCount = async () => {
      const { count: c } = await supabase
        .from('mensajes')
        .select('*', { count: 'exact', head: true })
        .eq('para', userId)
        .eq('leido', false)
      setCount(c || 0)
    }
    fetchCount()
  }, [userId])

  return (
    <a href="/mensajes" className="text-sm text-gray-600 flex items-center gap-1">
      Mensajes
      {count > 0 && (
        <span className="bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
          {count}
        </span>
      )}
    </a>
  )
}

export default function Home() {
  const [jugadores, setJugadores] = useState<any[]>([])
  const [escudos, setEscudos] = useState<Record<string, string>>({})
  const [tipoFutbol, setTipoFutbol] = useState<string | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroPosicion, setFiltroPosicion] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUsuario = async () => {
      const { data } = await supabase.auth.getUser()
      setUsuario(data.user)
      setCheckingAuth(false)
    }
    fetchUsuario()
  }, [])

  useEffect(() => {
    if (!usuario) return
    const fetchJugadores = async () => {
      setLoading(true)
      let query = supabase.from('profiles').select('*').eq('rol', 'jugador')
      if (tipoFutbol) query = query.eq('tipoFutbol', tipoFutbol)
      if (filtroCategoria) query = query.eq('categoria', filtroCategoria)
      if (filtroPosicion !== 'Todas') query = query.eq('posicion', filtroPosicion)
      if (busqueda) query = query.or(`nombre.ilike.%${busqueda}%,club.ilike.%${busqueda}%`)
      const { data } = await query
      const jugadoresList = data || []
      setJugadores(jugadoresList)

      const clubsUnicos = [...new Set(jugadoresList.map((j: any) => j.club).filter(Boolean))]
      if (clubsUnicos.length > 0) {
        const { data: clubsData } = await supabase
          .from('clubs')
          .select('nombre, escudo_url')
          .in('nombre', clubsUnicos)
        if (clubsData) {
          const mapa: Record<string, string> = {}
          clubsData.forEach((c: any) => { mapa[c.nombre] = c.escudo_url })
          setEscudos(mapa)
        }
      }

      setLoading(false)
    }
    fetchJugadores()
  }, [tipoFutbol, filtroCategoria, filtroPosicion, busqueda, usuario])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUsuario(null)
    router.refresh()
  }

  if (checkingAuth) return null

  if (!usuario) return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold">foot<span className="text-emerald-600">bapp</span></span>
          <a
            href="https://www.instagram.com/footbapp.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-emerald-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
        <a href="/auth/login" className="text-sm text-gray-500">Entrar</a>
      </header>

      <div className="max-w-lg mx-auto px-6 pt-16 pb-10 text-center flex-1">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
          <img src="/logo.png" alt="Footbapp" className="w-16 h-16 object-contain" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
          Hazte visible.<br/>Encuentra talento.
        </h1>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          La plataforma de fútbol aficionado y juvenil de Madrid donde jugadores se dan a conocer y scouts y equipos encuentran su próximo fichaje.
        </p>
        <a href="/auth/registro" className="block w-full bg-emerald-600 text-white rounded-xl py-3.5 text-sm font-medium mb-3">
          Crear perfil gratis
        </a>
        <a href="/auth/login" className="block w-full border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm mb-2">
          Ya tengo cuenta
        </a>
        <a href="/como-funciona" className="block w-full text-center text-sm text-gray-400 py-2">
          ¿Cómo funciona? →
        </a>
      </div>

      <div className="max-w-lg mx-auto px-6 pb-8 w-full">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { titulo: 'Jugadores', desc: 'Sube tus vídeos y muéstrate a los clubs' },
            { titulo: 'Scouts', desc: 'Encuentra talento en categorías regionales' },
            { titulo: 'Clubs', desc: 'Gestiona fichajes y contacta directamente' },
          ].map((item) => (
            <div key={item.titulo} className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs font-medium text-gray-900 mb-1">{item.titulo}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 text-center mb-12">
          <p className="text-sm font-medium text-emerald-800 mb-1">Fútbol amateur de Madrid</p>
          <p className="text-xs text-emerald-600">3ª RFEF · Preferente · Autonómica · Regional</p>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-400 mb-2">© 2026 Footbapp · app.footbapp@gmail.com</p>
        <div className="flex items-center justify-center gap-4">
          <a href="/privacidad" className="text-xs text-gray-400 hover:text-emerald-600">Privacidad</a>
          <a href="/terminos" className="text-xs text-gray-400 hover:text-emerald-600">Términos</a>
        </div>
      </footer>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <span className="text-lg font-semibold">foot<span className="text-emerald-600">bapp</span></span>
        <div className="flex items-center gap-3">
          <a href="/perfil" className="text-sm text-gray-600">Mi perfil</a>
          <MensajesBadge userId={usuario.id} />
          <button onClick={handleLogout} className="text-sm text-gray-400">Salir</button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        <input
          type="text"
          placeholder="Busca jugador, club, posición..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm mb-3 outline-none focus:border-emerald-500"
        />

        <div className="flex gap-2 overflow-x-auto px-4 mb-3">
          <button
            onClick={() => { setTipoFutbol(null); setFiltroCategoria('') }}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${!tipoFutbol ? 'bg-emerald-100 border border-emerald-400 text-emerald-700' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            Todos
          </button>
          <button
            onClick={() => { setTipoFutbol('aficionado'); setFiltroCategoria('') }}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${tipoFutbol === 'aficionado' ? 'bg-emerald-100 border border-emerald-400 text-emerald-700' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            Aficionado
          </button>
          <button
            onClick={() => { setTipoFutbol('juvenil'); setFiltroCategoria('') }}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${tipoFutbol === 'juvenil' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            Juvenil
          </button>
        </div>

        {tipoFutbol && (
          <div className="flex gap-2 overflow-x-auto px-4 mb-3">
            {(tipoFutbol === 'aficionado' ? CATEGORIAS_AFICIONADO : CATEGORIAS_JUVENIL).map(c => (
              <button
                key={c}
                onClick={() => setFiltroCategoria(c === filtroCategoria ? '' : c)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filtroCategoria === c ? 'bg-emerald-100 border border-emerald-400 text-emerald-700' : 'bg-white border border-gray-200 text-gray-600'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['Todas', ...POSICIONES].map((pos) => (
            <span
              key={pos}
              onClick={() => setFiltroPosicion(pos)}
              className={`shrink-0 text-xs px-3 py-1 rounded-full border cursor-pointer ${filtroPosicion === pos ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
            >
              {pos}
            </span>
          ))}
        </div>

        {loading && <p className="text-center text-sm text-gray-400 py-8">Cargando...</p>}

        {!loading && jugadores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No hay jugadores con estos filtros</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {jugadores.map((j) => (
            <a key={j.id} href={`/jugador/${j.id}`} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 items-start cursor-pointer hover:border-emerald-300 transition-colors">
              {j.avatar_url ? (
                <img src={j.avatar_url} alt={j.nombre} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0">
                  {j.nombre?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{j.nombre}</p>
                <div className="flex items-center gap-1.5 mb-2">
                  {escudos[j.club] && (
                    <img
                      src={escudos[j.club]}
                      alt={j.club}
                      className="w-4 h-4 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <p className="text-xs text-gray-500 truncate">{j.club} · {j.categoria}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {j.posicion && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">{j.posicion}</span>}
                  {j.edad && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{j.edad} años</span>}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="pb-6 pt-2 flex justify-center">
          <a
            href="https://www.instagram.com/footbapp.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            @footbapp.app
          </a>
        </div>
      </div>
    </main>
  )
}