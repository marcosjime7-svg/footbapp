'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function NuevaPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleGuardar = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    setError('')

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('No se pudo actualizar la contraseña. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    setListo(true)
    setTimeout(() => router.push('/'), 2000)
  }

  if (listo) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm text-center">
        <p className="text-2xl mb-3">✓</p>
        <p className="font-medium text-gray-900">Contraseña actualizada</p>
        <p className="text-sm text-gray-500 mt-2">Redirigiendo...</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm">
        <p className="text-lg font-semibold mb-1">foot<span className="text-emerald-600">bapp</span></p>
        <p className="text-sm text-gray-500 mb-6">Introduce tu nueva contraseña.</p>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Repite la contraseña"
            />
          </div>
          <button onClick={handleGuardar} disabled={loading} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </div>
      </div>
    </main>
  )
}