"use client";

import Link from "next/link";

export default function CancelPage() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>❌ Paiement annulé</h1>
      <p>Le paiement a été annulé. Vous pouvez essayer à nouveau.</p>
      <Link href="/#rdv">Retour au formulaire</Link>
    </main>
  );
}
