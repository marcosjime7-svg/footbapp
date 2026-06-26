export default function Terminos() {
  return (
    <main className="min-h-screen bg-white max-w-2xl mx-auto px-6 py-12">
      <a href="/" className="text-sm text-emerald-600 mb-8 block">← Volver</a>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: junio 2026</p>

      <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-900 mb-2">1. Descripción del servicio</h2>
          <p>Footbapp (footbapp.app) es una plataforma digital que permite a jugadores de fútbol amateur de Madrid crear un perfil público con su información deportiva y vídeos, con el objetivo de ser descubiertos por scouts y clubs.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">2. Aceptación de los términos</h2>
          <p>Al registrarte y usar Footbapp aceptas estos términos y condiciones. Si no estás de acuerdo, no uses la plataforma.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">3. Requisitos de uso</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Debes tener al menos 16 años para registrarte</li>
            <li>Los datos que proporciones deben ser verídicos</li>
            <li>Solo puedes tener una cuenta por persona</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">4. Contenido del usuario</h2>
          <p>Eres responsable del contenido que publiques en Footbapp (fotos, vídeos, información deportiva). Queda prohibido publicar contenido:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Falso o engañoso</li>
            <li>Ofensivo, discriminatorio o violento</li>
            <li>Que vulnere derechos de terceros</li>
            <li>Publicitario o de spam</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">5. Mensajes entre usuarios</h2>
          <p>El sistema de mensajería de Footbapp está destinado a facilitar el contacto profesional entre jugadores, scouts y clubs. Queda prohibido el uso para acoso, spam o cualquier comunicación inapropiada.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">6. Precio y pagos</h2>
          <p>El registro en Footbapp es gratuito. En el futuro podrán existir funcionalidades de pago opcionales. Serás informado con antelación de cualquier cambio en las condiciones económicas.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">7. Cancelación de cuenta</h2>
          <p>Puedes solicitar la eliminación de tu cuenta en cualquier momento escribiendo a app.footbapp@gmail.com. Nos comprometemos a eliminar todos tus datos en un plazo máximo de 30 días.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">8. Limitación de responsabilidad</h2>
          <p>Footbapp actúa como intermediario entre jugadores y scouts/clubs. No nos responsabilizamos de las relaciones, acuerdos o contratos que puedan surgir entre usuarios a través de la plataforma.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">9. Modificaciones del servicio</h2>
          <p>Nos reservamos el derecho de modificar, suspender o interrumpir el servicio en cualquier momento, notificándolo con la mayor antelación posible.</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">10. Contacto</h2>
          <p>Para cualquier consulta sobre estos términos escríbenos a <a href="mailto:app.footbapp@gmail.com" className="text-emerald-600">app.footbapp@gmail.com</a></p>
        </section>
      </div>
    </main>
  )
}