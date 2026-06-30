'use client'

import { useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CATEGORIAS_AFICIONADO, CATEGORIAS_JUVENIL } from '../../../utils/categorias'
import { useClubs } from '../../../utils/useClubs'
import { Turnstile } from '@marsidev/react-turnstile'

const posiciones = ['Portero', 'Lateral derecho', 'Lateral izquierdo', 'Central', 'Pivote', 'Centrocampista', 'Mediapunta', 'Extremo derecho', 'Extremo izquierdo', 'Delantero']

export default function Registro() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registrado, setRegistrado] = useState(false)
  const [mayorEdad, setMayorEdad] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [busquedaClub, setBusquedaClub] = useState('')
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', rol: 'jugador',
    club: '', categoria: '', posicion: '', edad: '', tipoFutbol: '',
  })

  const router = useRouter()
  const supabase = createClient()
  const { clubs } = useClubs()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSiguiente = () => {
    if (!mayorEdad) {
      setError('Debes confirmar que tienes 16 años o más')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    // Verificar Turnstile
    const turnstileRes = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: turnstileToken }),
    })
    const turnstileData = await turnstileRes.json()
    if (!turnstileData.success) {
      setError('Verificación de seguridad fallida. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

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

    setRegistrado(true)
    setLoading(false)
  }

  if (registrado) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✉️</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Revisa tu email</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Te hemos enviado un email de confirmación a <strong>{form.email}</strong>. Haz click en el enlace para activar tu cuenta.
        </p>
        <p className="text-xs text-gray-400">¿No lo ves? Revisa la carpeta de spam.</p>
        <a href="/auth/login" className="block w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-6">
          Ir al login
        </a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-1">foot<span className="text-emerald-600">bapp</span></h1>
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
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mayorEdad}
                onChange={(e) => setMayorEdad(e.target.checked)}
                className="mt-0.5 accent-emerald-600"
              />
              <span className="text-xs text-gray-500">Confirmo que tengo 16 años o más y acepto los <a href="/terminos" className="text-emerald-600">Términos</a> y la <a href="/privacidad" className="text-emerald-600">Política de Privacidad</a></span>
            </label>
            <button onClick={handleSiguiente} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-2">
              Siguiente →
            </button>
            <p className="text-center text-xs text-gray-400">¿Ya tienes cuenta? <a href="/auth/login" className="text-emerald-600">Entra aquí</a></p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Club actual</label>
              <input
                type="text"
                placeholder="Busca tu club..."
                value={busquedaClub || form.club}
                onChange={(e) => {
                  setBusquedaClub(e.target.value)
                  setForm({ ...form, club: e.target.value })
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 mb-1"
              />
              {busquedaClub.length > 1 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                  {clubs
                    .filter(c => c.nombre.toLowerCase().includes(busquedaClub.toLowerCase()))
                    .slice(0, 6)
                    .map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setForm({ ...form, club: c.nombre })
                          setBusquedaClub('')
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        {c.escudo_url && <img src={c.escudo_url} alt="" className="w-5 h-5 object-contain" />}
                        {c.nombre}
                      </div>
                    ))}
                </div>
              )}
              {form.club && !busquedaClub && (
                <p className="text-xs text-emerald-600 mt-1">✓ {form.club}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tipo de fútbol</label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipoFutbol: 'aficionado', categoria: '' })}
                  className={`flex-1 text-sm py-2 rounded-lg border ${form.tipoFutbol === 'aficionado' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                  Aficionado
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipoFutbol: 'juvenil', categoria: '' })}
                  className={`flex-1 text-sm py-2 rounded-lg border ${form.tipoFutbol === 'juvenil' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                  Juvenil
                </button>
              </div>

              {form.tipoFutbol && (
                <>
                  <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
                  <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                    <option value="">Selecciona categoría</option>
                    {(form.tipoFutbol === 'aficionado' ? CATEGORIAS_AFICIONADO : CATEGORIAS_JUVENIL).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </>
              )}
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
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setTurnstileToken(token)}
            />
            <button onClick={handleSubmit} disabled={loading || !turnstileToken} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-2 disabled:opacity-50">
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 text-center">← Volver</button>
          </div>
        )}
      </div>
    </main>
  )
}