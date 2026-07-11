'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Mensajes() {
  const [conversaciones, setConversaciones] = useState<any[]>([])
  const [noLeidos, setNoLeidos] = useState<Record<string, number>>({})
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

      // Contar no leídos por conversación
      const { data: noLeidosData } = await supabase
        .from('mensajes')
        .select('de')
        .eq('para', userData.user.id)
        .eq('leido', false)

      const conteo: Record<string, number> = {}
      ;(noLeidosData || []).forEach((m: any) => {
        conteo[m.de] = (conteo[m.de] || 0) + 1
      })
      setNoLeidos(conteo)

      setLoading(false)
    }
    init()
  }, [])

  const getOtro = (m: any) => {
    if (!usuario) return null
    return m.de === usuario.id ? m.para_perfil : m.de_perfil
  }

  const totalNoLeidos = Object.values(noLeidos).reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen bg-gray-50">
<div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>        <button onClick={() => router.push('/')} className="text-gray-400 text-sm">←</button>
        <span className="text-sm font-medium text-gray-900">Mensajes</span>
        {totalNoLeidos > 0 && (
          <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
            {totalNoLeidos}
          </span>
        )}
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
          const noLeidosConv = noLeidos[otro.id] || 0

          return (
            <div
              key={m.id}
              onClick={() => router.push(`/mensajes/${otro.id}`)}
              className={`border-b border-gray-100 px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${noLeidosConv > 0 ? 'bg-emerald-50' : 'bg-white'}`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0">
                {iniciales}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-sm ${noLeidosConv > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}`}>
                    {otro.nombre}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{fecha}</span>
                    {noLeidosConv > 0 && (
                      <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {noLeidosConv}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`text-xs truncate ${noLeidosConv > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                  {m.contenido}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}