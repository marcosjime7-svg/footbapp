'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CATEGORIAS_AFICIONADO, CATEGORIAS_JUVENIL } from '../../utils/categorias'

const ADMIN_ID = 'a08950eb-4071-4800-885e-f454e4e32bf7'
const POSICIONES = ['Portero', 'Lateral derecho', 'Lateral izquierdo', 'Central', 'Pivote', 'Centrocampista', 'Mediapunta', 'Extremo derecho', 'Extremo izquierdo', 'Delantero']

export default function Admin() {
  const [jugadores, setJugadores] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, verificados: 0, conVideos: 0 })
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<any>(null)
  const [guardando, setGuardando] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user || userData.user.id !== ADMIN_ID) {
        router.push('/')
        return
      }
      await fetchJugadores()
    }
    init()
  }, [])

  const fetchJugadores = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('rol', 'jugador')
      .order('created_at', { ascending: false })

    const lista = data || []
    setJugadores(lista)

    const { data: videosData } = await supabase
      .from('videos')
      .select('jugador_id')

    const conVideos = new Set(videosData?.map((v: any) => v.jugador_id) || [])

    setStats({
      total: lista.length,
      verificados: lista.filter((j: any) => j.verificado).length,
      conVideos: lista.filter((j: any) => conVideos.has(j.id)).length,
    })

    setLoading(false)
  }

  const handleVerificar = async (id: string, verificado: boolean) => {
    await supabase.from('profiles').update({ verificado: !verificado }).eq('id', id)
    setJugadores(jugadores.map(j => j.id === id ? { ...j, verificado: !verificado } : j))
    setStats(s => ({ ...s, verificados: s.verificados + (verificado ? -1 : 1) }))
  }

  const handleGuardarEdicion = async () => {
    setGuardando(true)
    await supabase.from('profiles').update({
      nombre: editando.nombre,
      club: editando.club,
      categoria: editando.categoria,
      posicion: editando.posicion,
      edad: parseInt(editando.edad) || null,
      altura: parseInt(editando.altura) >= 100 && parseInt(editando.altura) <= 220 ? parseInt(editando.altura) : null,
      temporadas: parseInt(editando.temporadas) || null,
      descripcion: editando.descripcion,
      partidos: parseInt(editando.partidos) || null,
      minutos: parseInt(editando.minutos) || null,
      goles: parseInt(editando.goles) || null,
      asistencias: parseInt(editando.asistencias) || null,
    }).eq('id', editando.id)
    setJugadores(jugadores.map(j => j.id === editando.id ? { ...j, ...editando } : j))
    setGuardando(false)
    setEditando(null)
  }

  const jugadoresFiltrados = jugadores.filter(j =>
    !busqueda || j.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || j.club?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Cargando...</p></div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 text-sm">←</button>
          <span className="text-sm font-medium text-gray-900">Panel Admin</span>
        </div>
        <span className="text-xs text-emerald-600 font-medium">footbapp</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: stats.total, lbl: 'Jugadores' },
            { val: stats.verificados, lbl: 'Verificados' },
            { val: stats.conVideos, lbl: 'Con vídeos' },
          ].map(s => (
            <div key={s.lbl} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
              <span className="block text-2xl font-semibold text-gray-900">{s.val}</span>
              <span className="text-xs text-gray-400">{s.lbl}</span>
            </div>
          ))}
        </div>

        {/* Búsqueda */}
        <input
          type="text"
          placeholder="Buscar jugador o club..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm mb-4 outline-none focus:border-emerald-500"
        />

        {/* Lista */}
        <div className="flex flex-col gap-3">
          {jugadoresFiltrados.map(j => (
            <div key={j.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{j.nombre}</p>
                  <p className="text-xs text-gray-500 truncate">{j.club} · {j.categoria} · {j.posicion}</p>
                  <p className="text-xs text-gray-400">{j.edad} años · {j.altura ? `${j.altura}cm` : 'sin altura'}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleVerificar(j.id, j.verificado)}
                    className={`text-xs px-2 py-1 rounded-lg border ${j.verificado ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                  >
                    {j.verificado ? '✓ Verificado' : 'Verificar'}
                  </button>
                  <button
                    onClick={() => setEditando({ ...j })}
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 text-gray-500"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal edición */}
      {editando && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-gray-900">Editar jugador</p>
              <button onClick={() => setEditando(null)} className="text-gray-400 text-sm">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                <input value={editando.nombre || ''} onChange={e => setEditando({ ...editando, nombre: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Club</label>
                <input value={editando.club || ''} onChange={e => setEditando({ ...editando, club: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
                <input value={editando.categoria || ''} onChange={e => setEditando({ ...editando, categoria: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Posición</label>
                <select value={editando.posicion || ''} onChange={e => setEditando({ ...editando, posicion: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                  {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Edad</label>
                  <input type="number" value={editando.edad || ''} onChange={e => setEditando({ ...editando, edad: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Altura</label>
                  <input type="number" value={editando.altura || ''} onChange={e => setEditando({ ...editando, altura: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Temporadas</label>
                  <input type="number" value={editando.temporadas || ''} onChange={e => setEditando({ ...editando, temporadas: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Partidos</label>
                  <input type="number" value={editando.partidos || ''} onChange={e => setEditando({ ...editando, partidos: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Minutos</label>
                  <input type="number" value={editando.minutos || ''} onChange={e => setEditando({ ...editando, minutos: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Goles</label>
                  <input type="number" value={editando.goles || ''} onChange={e => setEditando({ ...editando, goles: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Asistencias</label>
                  <input type="number" value={editando.asistencias || ''} onChange={e => setEditando({ ...editando, asistencias: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                <textarea value={editando.descripcion || ''} onChange={e => setEditando({ ...editando, descripcion: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-none" />
              </div>
              <button onClick={handleGuardarEdicion} disabled={guardando} className="w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50">
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
