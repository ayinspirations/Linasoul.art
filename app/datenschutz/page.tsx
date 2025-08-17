export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-light text-gray-900">Datenschutzerklärung</h1>

      <p className="mb-4">
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Ihre Daten werden vertraulich und 
        entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung behandelt.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">1. Verantwortlich</h2>
      <p className="mb-4">
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
        <strong>Selina Sickinger</strong><br />
        Paracelsusstr. 18, 71229 Leonberg<br />
        E-Mail: <a href="mailto:linasoul.art@gmx.de" className="underline">linasoul.art@gmx.de</a>
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">2. Erhebung und Speicherung personenbezogener Daten</h2>
      <p className="mb-4">
        Wir erheben personenbezogene Daten nur, wenn Sie uns diese im Rahmen einer Bestellung oder bei 
        einer Kontaktaufnahme freiwillig mitteilen. Die Verarbeitung erfolgt ausschließlich zur Abwicklung 
        des Vertrags oder zur Bearbeitung Ihrer Anfrage.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">3. Zahlungsanbieter Stripe</h2>
      <p className="mb-4">
        Bei Zahlungen über unseren Shop nutzen wir den Zahlungsanbieter Stripe. Die Datenverarbeitung 
        durch Stripe erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsabwicklung). 
        Weitere Informationen finden Sie in der Datenschutzerklärung von Stripe:{" "}
        <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="underline">
          https://stripe.com/de/privacy
        </a>
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">4. Web-Analyse mit Vercel Analytics</h2>
      <p className="mb-4">
        Diese Website nutzt Vercel Analytics, einen Dienst der Vercel Inc., zur Analyse der 
        Besucherströme. Es werden ausschließlich anonymisierte Daten erfasst, die keine Rückschlüsse 
        auf einzelne Personen zulassen. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f 
        DSGVO (berechtigtes Interesse an einer nutzerfreundlichen Website).
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">5. Weitergabe von Daten</h2>
      <p className="mb-4">
        Eine Weitergabe Ihrer Daten an Dritte erfolgt ausschließlich, soweit dies zur Vertragserfüllung 
        erforderlich ist (z.B. an Zahlungsanbieter oder Versanddienstleister).
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">6. Ihre Rechte</h2>
      <p className="mb-4">
        Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung 
        sowie Widerspruch gegen die Verarbeitung Ihrer Daten. Hierzu können Sie sich jederzeit an die oben 
        angegebene Adresse wenden.
      </p>
    </main>
  )
}
