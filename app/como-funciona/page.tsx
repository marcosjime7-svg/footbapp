export default function ComoFunciona() {
  return (
    <main className="min-h-screen bg-white max-w-lg mx-auto px-6 py-12">
      <a href="/" className="text-sm text-emerald-600 mb-8 block">← Volver</a>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo funciona?</h1>
      <p className="text-sm text-gray-400 mb-10">Tres pasos para hacerte visible</p>

      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">1</div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Crea tu perfil gratis</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Regístrate en menos de 2 minutos. Añade tu club, categoría, posición y datos deportivos. Tu perfil será visible para todos los scouts y clubs de Madrid.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">2</div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Sube tus highlights</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Añade vídeos de tus mejores jugadas — goles, asistencias, intervenciones. Puedes subir vídeos desde tu galería o pegar un enlace de YouTube.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">3</div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Recibe contactos</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Scouts y clubs de toda la Comunidad de Madrid pueden encontrarte y contactarte directamente a través de la mensajería de Footbapp.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-emerald-50 rounded-2xl p-6 text-center">
        <p className="text-sm font-medium text-emerald-800 mb-4">¿Listo para empezar?</p>
        <a href="/auth/registro" className="block w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium">
          Crear perfil gratis
        </a>
      </div>
    </main>
  )
}