"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "@/components/portalPage.module.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    fetch(`${apiUrl}/api/appointments/${appointmentId}`)
      .then((res) => res.json())
      .then((data) => setAppointment(data))
      .catch(() => setMessage("Impossible de charger votre rendez-vous."))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const handleConfirm = async () => {
    if (!appointmentId) return;
    setConfirming(true);
    setMessage("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const response = await fetch(`${apiUrl}/api/appointments/${appointmentId}/confirm`, {
      method: "POST",
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "La confirmation a échoué.");
      setConfirming(false);
      return;
    }

    setAppointment(data.appointment);
    setMessage(data.reminderSent ? "Votre rendez-vous est confirmé. Un email de confirmation vient de vous être envoyé." : "Votre rendez-vous est confirmé. L’email de confirmation n’a pas pu être envoyé pour le moment.");
    setConfirming(false);
  };

  return (
    <div className={styles.pageShell}>
      <Navbar />
      <main className={styles.pageInner}>
        <section className={`${styles.heroCard} ${styles.grid}`}>
          <div>
            <p className={styles.eyebrow}>Confirmation de rendez-vous</p>
            <h1 className={styles.pageTitle}>Réservation en attente de confirmation</h1>
            <p className={styles.pageText}>Voici le détail de votre rendez-vous. Confirmez-le ci-dessous pour recevoir votre confirmation par email.</p>
          </div>

          {loading ? <p className={styles.pageText}>Chargement...</p> : null}
          {message ? <p className={styles.successText}>{message}</p> : null}

          {appointment ? (
            <div className={styles.panelCard}>
              <p className={styles.statusBadge}>{appointment.status === "confirmed" ? "Confirmé" : "En attente"}</p>
              <div className={styles.infoList}>
                <div className={styles.infoItem}><strong>Prénom :</strong> {appointment.firstName}</div>
                <div className={styles.infoItem}><strong>Nom :</strong> {appointment.lastName}</div>
                <div className={styles.infoItem}><strong>Téléphone :</strong> {appointment.phone}</div>
                <div className={styles.infoItem}><strong>Email :</strong> {appointment.email}</div>
                <div className={styles.infoItem}><strong>Date :</strong> {new Date(appointment.datetime).toLocaleString("fr-FR")}</div>
              </div>
            </div>
          ) : null}

          {appointment ? (
            <div className={styles.buttonRow}>
              <button className={styles.button} onClick={handleConfirm} disabled={confirming}>
                {confirming ? "Confirmation..." : "Confirmer le rendez-vous"}
              </button>
              <Link href="/" className={styles.secondaryButton}>Retour à l'accueil</Link>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
