export default function Privacidad() {
  return (
    <main className="min-h-screen bg-white max-w-2xl mx-auto px-6 py-12">
      <a href="/" className="text-sm text-emerald-600 mb-8 block">← Volver</a>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: junio 2026</p>

      <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">1. Responsable del tratamiento</h2>
          <p>Marcos Jiménez Atance, con email de contacto app.footbapp@gmail.com, es el responsable del tratamiento de los datos personales recogidos a través de la plataforma Footbapp (footbapp.app).</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">2. Datos que recogemos</h2>
          <p>Al registrarte en Footbapp recogemos los siguientes datos:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Nombre y apellidos</li>
            <li>Dirección de correo electrónico</li>
            <li>Datos deportivos: club, categoría, posición, edad, altura, temporadas</li>
            <li>Fotografía de perfil (opcional)</li>
            <li>Vídeos de highlights (opcional)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">3. Finalidad del tratamiento</h2>
          <p>Los datos recogidos se utilizan para:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Crear y gestionar tu perfil de jugador en la plataforma</li>
            <li>Facilitar que scouts y clubs puedan contactarte</li>
            <li>Enviarte comunicaciones relacionadas con el servicio</li>
            <li>Mejorar la experiencia de uso de la plataforma</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">4. Base legal</h2>
          <p>El tratamiento de tus datos se basa en el consentimiento que nos otorgas al registrarte en la plataforma y aceptar estos términos.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">5. Almacenamiento de datos</h2>
          <p>Los datos se almacenan de forma segura en servidores de Supabase (base de datos) y Cloudflare R2 (archivos multimedia), ambos con cifrado en tránsito y en reposo.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">6. Visibilidad del perfil</h2>
          <p>Tu perfil, incluyendo nombre, club, categoría, posición y vídeos, es visible para todos los usuarios registrados en la plataforma. Si deseas eliminar tu perfil y todos tus datos, puedes solicitarlo en app.footbapp@gmail.com.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">7. Tus derechos</h2>
          <p>Tienes derecho a acceder, rectificar, suprimir, oponerte y limitar el tratamiento de tus datos personales. Para ejercer estos derechos contacta con nosotros en app.footbapp@gmail.com.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">8. Menores de edad</h2>
          <p>Footbapp está destinado exclusivamente a mayores de 16 años. No recogemos conscientemente datos de menores. Si detectamos que un usuario es menor de 16 años, eliminaremos su cuenta.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">9. Cambios en la política</h2>
          <p>Podemos actualizar esta política de privacidad. Te notificaremos de cambios significativos por email o mediante un aviso en la plataforma.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">10. Contacto</h2>
          <p>Para cualquier consulta sobre privacidad escríbenos a <a href="mailto:app.footbapp@gmail.com" className="text-emerald-600">app.footbapp@gmail.com</a></p>
        </section>
      </div>
    </main>
  )
}