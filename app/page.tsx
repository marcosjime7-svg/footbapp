'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CATEGORIAS } from '../utils/categorias'

export default function Home() {
  const [jugadores, setJugadores] = useState<any[]>([])
  const [filtro, setFiltro] = useState('Todos')
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
      if (filtro !== 'Todos') query = query.eq('categoria', filtro)
      if (busqueda) query = query.ilike('nombre', `%${busqueda}%`)
      const { data } = await query
      setJugadores(data || [])
      setLoading(false)
    }
    fetchJugadores()
  }, [filtro, busqueda, usuario])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUsuario(null)
    router.refresh()
  }

  if (checkingAuth) return null

  if (!usuario) return (
    <main className="min-h-screen bg-white">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-xl font-semibold">foot<span className="text-emerald-600">bapp</span></span>
        <a href="/auth/login" className="text-sm text-gray-500">Entrar</a>
      </header>

      <div className="max-w-lg mx-auto px-6 pt-16 pb-10 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
          Hazte visible.<br/>Encuentra talento.
        </h1>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          La plataforma de fútbol amateur de Madrid donde jugadores se dan a conocer y scouts encuentran su próximo fichaje.
        </p>
        <a href="/auth/registro" className="block w-full bg-emerald-600 text-white rounded-xl py-3.5 text-sm font-medium mb-3">
          Crear perfil gratis
        </a>
        <a href="/auth/login" className="block w-full border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm">
          Ya tengo cuenta
        </a>
      </div>

      <div className="max-w-lg mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { titulo: 'Jugadores', desc: 'Sube tus vídeos y muéstrate a los clubs' },
            { titulo: 'Scouts', desc: 'Encuentra talento en categorías regionales' },
            { titulo: 'Clubs', desc: 'Gestiona fichajes y contacta directamente' },
          ].map((item) => (
            <div key={item.titulo} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-xs font-medium text-gray-900 mb-1">{item.titulo}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 text-center">
          <p className="text-sm font-medium text-emerald-800 mb-1">Fútbol amateur de Madrid</p>
          <p className="text-xs text-emerald-600">3ª RFEF · Preferente · Autonómica · Regional</p>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold">foot<span className="text-emerald-600">bapp</span></span>
        <div className="flex items-center gap-3">
          <a href="/perfil" className="text-sm text-gray-600">Mi perfil</a>
          <a href="/mensajes" className="text-sm text-gray-600">Mensajes</a>
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

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['Todos', ...CATEGORIAS].map((cat) => (
            <span
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`shrink-0 text-xs px-3 py-1 rounded-full border cursor-pointer ${filtro === cat ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-white border-gray-200 text-gray-500'}`}
            >
              {cat}
            </span>
          ))}
        </div>

        {loading && <p className="text-center text-sm text-gray-400 py-8">Cargando...</p>}

        {!loading && jugadores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No hay jugadores aún</p>
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
                <p className="text-xs text-gray-500 mb-2">{j.club} · {j.categoria}</p>
                <div className="flex gap-2 flex-wrap">
                  {j.posicion && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">{j.posicion}</span>}
                  {j.edad && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{j.edad} años</span>}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}