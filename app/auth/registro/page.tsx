'use client'

import { useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CATEGORIAS } from '../../../utils/categorias'

const posiciones = ['Portero', 'Lateral derecho', 'Lateral izquierdo', 'Central', 'Pivote', 'Centrocampista', 'Mediapunta', 'Extremo derecho', 'Extremo izquierdo', 'Delantero']

export default function Registro() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', rol: 'jugador',
    club: '', categoria: '', posicion: '', edad: '',
  })

  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          rol: form.rol,
          club: form.club,
          categoria: form.categoria,
          posicion: form.posicion,
          edad: parseInt(form.edad) || null,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-1">fut<span className="text-emerald-600">madrid</span></h1>
        <p className="text-sm text-gray-500 mb-6">Crea tu perfil y hazte visible</p>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nombre completo</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">¿Eres...?</label>
              <div className="grid grid-cols-4 gap-2">
                {['jugador', 'scout', 'club', 'agencia'].map((r) => (
                  <button key={r} onClick={() => setForm({ ...form, rol: r })} className={`py-2 rounded-lg text-xs border capitalize ${form.rol === r ? 'bg-emerald-100 border-emerald-400 text-emerald-700 font-medium' : 'border-gray-200 text-gray-500'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-2">
              Siguiente →
            </button>
            <p className="text-center text-xs text-gray-400">¿Ya tienes cuenta? <a href="/auth/login" className="text-emerald-600">Entra aquí</a></p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Club actual</label>
              <input name="club" value={form.club} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Nombre del club" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
              <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                <option value="">Selecciona categoría</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {form.rol === 'jugador' && (
              <>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Posición</label>
                  <select name="posicion" value={form.posicion} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                    <option value="">Selecciona posición</option>
                    {posiciones.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Edad</label>
                  <input name="edad" type="number" value={form.edad} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Tu edad" />
                </div>
              </>
            )}
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-2 disabled:opacity-50">
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
            <p className="text-center text-xs text-gray-400">Acceso completo por <strong className="text-gray-600">2,99€ pago único</strong> al verificar perfil</p>
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 text-center">← Volver</button>
          </div>
        )}
      </div>
    </main>
  )
}