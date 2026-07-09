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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm">
        <p className="text-lg font-semibold mb-1">foot<span className="text-emerald-600">bapp</span></p>
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
          <div className="text-right">
            <a href="/auth/reset-password" className="text-xs text-gray-400 hover:text-emerald-600">¿Olvidaste tu contraseña?</a>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-1 disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="text-center text-xs text-gray-400">¿No tienes cuenta? <a href="/auth/registro" className="text-emerald-600">Regístrate gratis</a></p>
        </div>
      </div>
      <a
        href="https://www.instagram.com/footbapp.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
        @footbapp.app
      </a>
    </main>
  )
}