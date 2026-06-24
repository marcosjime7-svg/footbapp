'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'

export default function Chat() {
  const [mensajes, setMensajes] = useState<any[]>([])
  const [otro, setOtro] = useState<any>(null)
  const [usuario, setUsuario] = useState<any>(null)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { router.push('/auth/login'); return }
      setUsuario(userData.user)

      const { data: otroPerfil } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single()
      setOtro(otroPerfil)

      const { data } = await supabase
        .from('mensajes')
        .select('*')
        .or(`and(de.eq.${userData.user.id},para.eq.${params.id}),and(de.eq.${params.id},para.eq.${userData.user.id})`)
        .order('created_at', { ascending: true })

      setMensajes(data || [])
      setLoading(false)
    }
    init()
  }, [params.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const handleEnviar = async () => {
    if (!texto.trim() || !usuario) return

    const nuevoMensaje = {
      de: usuario.id,
      para: params.id as string,
      contenido: texto,
    }

    const { data } = await supabase
      .from('mensajes')
      .insert(nuevoMensaje)
      .select()
      .single()

    if (data) {
      setMensajes([...mensajes, data])
      setTexto('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push('/mensajes')} className="text-gray-400 text-sm">←</button>
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs shrink-0">
          {otro?.nombre?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{otro?.nombre}</p>
          <p className="text-xs text-gray-400">{otro?.club} · {otro?.categoria}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {loading && <p className="text-center text-sm text-gray-400 py-8">Cargando...</p>}

        <div className="flex flex-col gap-3">
          {mensajes.map((m) => {
            const esMio = m.de === usuario?.id
            const hora = new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

            return (
              <div key={m.id} className={`flex flex-col ${esMio ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${esMio ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
                  {m.contenido}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">{hora}</span>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3 max-w-lg mx-auto w-full">
        <div className="flex gap-2 items-end">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm outline-none resize-none"
          />
          <button
            onClick={handleEnviar}
            disabled={!texto.trim()}
            className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white disabled:opacity-40 shrink-0"
          >
            →
          </button>
        </div>
      </div>
    </main>
  )
}