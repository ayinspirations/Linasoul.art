export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-light text-gray-900">Impressum</h1>

      <p className="mb-4">
        Angaben gemäß § 5 TMG
      </p>

      <p className="mb-4">
        <strong>Selina Sickinger</strong><br />
        Paracelsusstr. 18<br />
        71229 Leonberg<br />
        Deutschland
      </p>

      <p className="mb-4">
        E-Mail: <a href="mailto:linasoul.art@gmx.de" className="underline">linasoul.art@gmx.de</a>
      </p>

      <p className="mb-4">
        Umsatzsteuer-Identifikationsnummer: <br />
        Keine, da Kleinunternehmer gemäß §19 UStG.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Haftungsausschluss</h2>
      <p className="mb-4">
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für Inhalte externer Links. 
        Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Online-Streitbeilegung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr" className="underline" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
      </p>
    </main>
  )
}
