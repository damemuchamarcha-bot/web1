import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Dame Marcha',
  description: 'Política de privacidad y protección de datos de la revista Dame Marcha.',
}

export default function PoliticaPrivacidadPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-zinc-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-amber-400">Política de Privacidad</h1>

      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Responsable del Tratamiento de Datos</h2>
          <p>
            El responsable del tratamiento de los datos recabados a través de este sitio web es el equipo de <strong>Dame Marcha</strong> (correo de contacto: <strong>contacto@damemarcha.com</strong>).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Finalidad del Tratamiento</h2>
          <p>
            Los datos personales que nos facilites a través del formulario de suscripción (dirección de correo electrónico) serán utilizados exclusivamente para enviarte nuestro boletín de noticias (newsletter) con las últimas publicaciones, artículos y novedades culturales de Dame Marcha.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Legitimación</h2>
          <p>
            La base legal para el tratamiento de tus datos es el consentimiento expreso otorgado al introducir tu correo electrónico y suscribirte a la newsletter.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Destinatarios de los Datos</h2>
          <p>
            Para gestionar la lista de suscriptores y enviar las newsletters automáticas, utilizamos los servicios de la plataforma <strong>Brevo</strong> (Sendinblue SAS), cuyos servidores se encuentran ubicados dentro de la Unión Europea y cumplen estrictamente con el RGPD. No se cederán datos a otros terceros salvo obligación legal.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Derechos del Usuario</h2>
          <p>
            Tienes derecho a acceder, rectificar, limitar el tratamiento, oponerte o solicitar la supresión de tus datos en cualquier momento. Para ejercer estos derechos, o para darnos de baja de la newsletter, puedes pulsar el enlace de «Cancelar suscripción» que aparece en el pie de cada correo recibido o enviar un email a <strong>contacto@damemarcha.com</strong>.
          </p>
        </section>
      </div>
    </main>
  )
}
