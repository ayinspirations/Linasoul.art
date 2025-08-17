// app/agb/page.tsx
export default function AgbPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-gray-800">
      <h1 className="mb-8 text-3xl font-light text-gray-900">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold">1. Geltungsbereich</h2>
          <p>
            Diese AGB gelten für alle Bestellungen über unseren Online-Shop und richten sich ausschließlich an Verbraucher.
            Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu überwiegend privaten Zwecken abschließt.
            Unternehmer ist jede natürliche oder juristische Person bzw. rechtsfähige Personengesellschaft, die bei
            Vertragsschluss in Ausübung ihrer gewerblichen oder selbständigen Tätigkeit handelt.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">2. Vertragspartner, Vertragsschluss, Korrektur</h2>
          <p>
            Vertragspartner: <strong>Selina Sickinger, Paracelsusstraße 18, 71229 Leonberg, Deutschland.</strong><br />
            Mit Einstellung der Produkte in den Shop geben wir ein verbindliches Angebot ab. Sie können Artikel unverbindlich
            in den Warenkorb legen und Eingaben vor Absenden der Bestellung korrigieren. Durch Klick auf den Bestell-Button
            nehmen Sie das Angebot an. Unmittelbar danach erhalten Sie eine Bestätigung per E-Mail.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">3. Vertragssprache, Vertragstext</h2>
          <p>
            Vertragssprache ist Deutsch. Der Vertragstext wird von uns nicht gespeichert; Sie erhalten Bestelldaten und AGB per E-Mail.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">4. Lieferbedingungen</h2>
          <p>
            Versand an die im Bestellprozess angegebene Lieferadresse. Keine Selbstabholung, keine Lieferung an Packstationen.
            </p>
            <p>
  Wir liefern standardmäßig nur innerhalb Deutschlands. Der Versand innerhalb
  Deutschlands ist für unsere Kunden <strong>kostenlos</strong>.
</p>
<p>
  Ein Versand in andere Länder der Europäischen Union oder weltweit ist auf Anfrage möglich. 
  Hierfür können <strong>zusätzliche Versandkosten</strong> anfallen, die wir Ihnen vor 
  Vertragsschluss mitteilen.
</p>
<p>
  Die Lieferung erfolgt durch einen von uns ausgewählten Versanddienstleister
  an die von Ihnen angegebene Lieferadresse, sofern nichts anderes vereinbart ist.
</p>
          
        </section>

        <section>
          <h2 className="font-semibold">5. Preise und Versandkosten</h2>
          <p>
            Alle Preise sind Endpreise nach § 19 UStG (Kleinunternehmerregelung, keine Umsatzsteuer).
            Versandkosten werden im Bestellprozess ausgewiesen.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">6. Zahlung</h2>
          <p>
            Zahlung per <strong>Stripe</strong> (z. B. Kreditkarte, SEPA-Lastschrift) oder <strong>Banküberweisung</strong>.
            Verfügbare Optionen werden im Checkout angezeigt.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">7. Eigentumsvorbehalt</h2>
          <p>Die Ware bleibt bis zur vollständigen Zahlung unser Eigentum.</p>
        </section>

        <section>
          <h2 className="font-semibold">8. Transportschäden</h2>
          <p>
            Bitte offensichtliche Transportschäden möglichst sofort beim Zusteller reklamieren und uns zeitnah informieren.
            Ihre gesetzlichen Rechte bleiben unberührt.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">9. Gewährleistung und Garantien</h2>
          <p>
            Es gilt das gesetzliche Mängelhaftungsrecht. Garantien bestehen nur, wenn sie ausdrücklich beim Produkt angegeben sind.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">10. Haftung</h2>
          <p>
            Wir haften unbeschränkt bei Verletzung von Leben, Körper oder Gesundheit, bei Vorsatz/grober Fahrlässigkeit,
            bei übernommenen Garantien sowie nach dem Produkthaftungsgesetz. Bei leicht fahrlässiger Verletzung wesentlicher
            Vertragspflichten ist die Haftung auf den vorhersehbaren, typischen Schaden begrenzt.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">11. Widerrufsrecht</h2>
          <p>
            Verbraucher haben ein 14-tägiges Widerrufsrecht. Ausgenommen sind individuell angefertigte Werke.
            Details siehe <a href="/widerruf" className="underline text-blue-600 hover:text-blue-800">Widerrufsbelehrung</a>.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">12. Streitbeilegung</h2>
          <p>
            Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </main>
  )
}
