'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Mensajes() {
  const [conversaciones, setConversaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { router.push('/auth/login'); return }
      setUsuario(userData.user)

      const { data } = await supabase
        .from('mensajes')
        .select(`
          *,
          de_perfil:profiles!mensajes_de_fkey(id, nombre, club, rol),
          para_perfil:profiles!mensajes_para_fkey(id, nombre, club, rol)
        `)
        .or(`de.eq.${userData.user.id},para.eq.${userData.user.id}`)
        .order('created_at', { ascending: false })

      const vistas = new Set()
      const convs = (data || []).filter((m: any) => {
        const key = [m.de, m.para].sort().join('-')
        if (vistas.has(key)) return false
        vistas.add(key)
        return true
      })

      setConversaciones(convs)
      setLoading(false)
    }
    init()
  }, [])

  const getOtro = (m: any) => {
    if (!usuario) return null
    return m.de === usuario.id ? m.para_perfil : m.de_perfil
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="text-gray-400 text-sm">←</button>
        <span className="text-sm font-medium text-gray-900">Mensajes</span>
      </div>

      <div className="max-w-lg mx-auto">
        {loading && <p className="text-center text-sm text-gray-400 py-8">Cargando...</p>}

        {!loading && conversaciones.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No tienes mensajes aún</p>
          </div>
        )}

        {conversaciones.map((m) => {
          const otro = getOtro(m)
          if (!otro) return null
          const iniciales = otro.nombre?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
          const fecha = new Date(m.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

          return (
            <div key={m.id} onClick={() => router.push(`/mensajes/${otro.id}`)} className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0">
                {iniciales}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-medium text-gray-900">{otro.nombre}</p>
                  <span className="text-xs text-gray-400">{fecha}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.contenido}</p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
} 