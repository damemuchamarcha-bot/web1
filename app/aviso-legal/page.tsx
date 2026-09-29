import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal | Dame Marcha',
  description: 'Información legal y condiciones de uso de la revista Dame Marcha.',
}

export default function AvisoLegalPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-zinc-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-amber-400">Aviso Legal</h1>
      
      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Datos Identificativos</h2>
          <p>
            En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se exponen los siguientes datos del sitio web:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Denominación / Proyecto:</strong> Revista Dame Marcha</li>
            <li><strong>Correo electrónico de contacto:</strong> contacto@damemarcha.com</li>
            <li><strong>Sitio web:</strong> Dame Marcha</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Objeto y Ámbito de Aplicación</h2>
          <p>
            El presente Aviso Legal regula el acceso, navegación y uso del sitio web Dame Marcha. El acceso y uso de este sitio web le atribuye la condición de Usuario, e implica la aceptación de todas las condiciones incluidas en este aviso.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Propiedad Intelectual e Industrial</h2>
          <p>
            Los contenidos de este sitio web (textos, artículos, imágenes, logotipos, diseño gráfico y código fuente) son propiedad de Dame Marcha o de terceros que han autorizado su uso, quedando protegidos por la legislación sobre propiedad intelectual e industrial.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Exención de Responsabilidad</h2>
          <p>
            Dame Marcha no se hace responsable de los daños o perjuicios que pudieran derivarse de interferencias, omisiones, interrupciones, virus informáticos o desconexiones en el funcionamiento operativo de este sistema electrónico.
          </p>
        </section>
      </div>
    </main>
  )
}
