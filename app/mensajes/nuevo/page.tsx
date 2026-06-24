'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function NuevoMensajeForm() {
  const [jugador, setJugador] = useState<any>(null)
  const [usuario, setUsuario] = useState<any>(null)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const para = searchParams.get('para')
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { router.push('/auth/login'); return }
      setUsuario(userData.user)

      if (para) {
        const { data } = await supabase.from('profiles').select('*').eq('id', para).single()
        setJugador(data)
      }
    }
    init()
  }, [para])

  const handleEnviar = async () => {
    if (!texto.trim() || !usuario || !para) return
    setLoading(true)

    const { error } = await supabase.from('mensajes').insert({
      de: usuario.id,
      para: para,
      contenido: texto,
    })

    if (!error) {
      setEnviado(true)
      setTimeout(() => router.push('/mensajes'), 1500)
    }
    setLoading(false)
  }

  if (enviado) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl mb-2">✓</p>
        <p className="text-gray-600 text-sm">Mensaje enviado</p>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 text-sm">←</button>
        <div>
          <p className="text-sm font-medium text-gray-900">{jugador?.nombre || 'Cargando...'}</p>
          <p className="text-xs text-gray-400">{jugador?.club} · {jugador?.categoria}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <p className="text-xs text-gray-400 mb-2">Mensaje</p>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={5}
            placeholder={`Hola ${jugador?.nombre?.split(' ')[0] || ''}...`}
            className="w-full text-sm text-gray-700 outline-none resize-none"
          />
        </div>
        <button
          onClick={handleEnviar}
          disabled={loading || !texto.trim()}
          className="w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">Tu contacto permanece privado hasta que decidas compartirlo</p>
      </div>
    </main>
  )
}

export default function NuevoMensaje() {
  return (
    <Suspense>
      <NuevoMensajeForm />
    </Suspense>
  )
}