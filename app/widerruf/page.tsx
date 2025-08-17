export default function WiderrufPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-gray-800">
      <h1 className="mb-6 text-3xl font-light text-gray-900">Widerrufsbelehrung</h1>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold">Widerrufsrecht</h2>
        <p>
          Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
          Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter,
          der nicht der Beförderer ist, die Ware in Besitz genommen haben.
        </p>

        <h2 className="mt-6 text-lg font-semibold">Folgen des Widerrufs</h2>
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
          einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie
          eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben),
          unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
          Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
        </p>
        <p>
          Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
          eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.
          In keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
        </p>

        <h2 className="mt-6 text-lg font-semibold">Rücksendekosten</h2>
        <p>
          <strong>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</strong>
          Nicht paketversandfähige Waren werden bei Ihnen abgeholt; die Kosten hierfür tragen ebenfalls Sie.
        </p>

        <h2 className="mt-6 text-lg font-semibold">Ausschluss bzw. Erlöschen des Widerrufsrechts</h2>
        <p>
          Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren,
          die nach Kundenspezifikation angefertigt werden oder eindeutig auf die persönlichen Bedürfnisse(Auftragsarbeiten) zugeschnitten sind.
        </p>

        <p className="pt-2 text-xs text-gray-500">
          Stand: {new Date().toLocaleDateString("de-DE")}
        </p>
      </section>
    </main>
  );
}
