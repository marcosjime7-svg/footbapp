'use client'

import { useState } from 'react'
import { createClient } from '../../../utils/supabase/client'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleReset = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/nueva-password`,
    })

    if (resetError) {
      setError('No se pudo enviar el email. Comprueba la dirección.')
      setLoading(false)
      return
    }

    setEnviado(true)
    setLoading(false)
  }

  if (enviado) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm text-center">
        <p className="text-2xl mb-3">✉️</p>
        <p className="font-medium text-gray-900 mb-2">Revisa tu email</p>
        <p className="text-sm text-gray-500 mb-4">Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong></p>
        <a href="/auth/login" className="text-sm text-emerald-600">Volver al login</a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm">
        <a href="/auth/login" className="text-xs text-gray-400 mb-4 block">← Volver</a>
        <p className="text-lg font-semibold mb-1">foot<span className="text-emerald-600">bapp</span></p>
        <p className="text-sm text-gray-500 mb-6">Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.</p>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <button onClick={handleReset} disabled={loading} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </div>
      </div>
    </main>
  )
}