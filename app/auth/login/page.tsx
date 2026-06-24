'use client'

import { useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (loginError) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-1">fut<span className="text-emerald-600">madrid</span></h1>
        <p className="text-sm text-gray-500 mb-6">Entra en tu cuenta</p>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Tu contraseña" />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-2 disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="text-center text-xs text-gray-400">¿No tienes cuenta? <a href="/auth/registro" className="text-emerald-600">Regístrate gratis</a></p>
        </div>
      </div>
    </main>
  )
}