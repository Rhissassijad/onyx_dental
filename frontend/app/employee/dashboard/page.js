"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "@/components/portalPage.module.css";

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    datetime: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const loadAppointments = async () => {
    const token = localStorage.getItem("employeeToken");
    if (!token) {
      router.push("/employee/login");
      return;
    }

    try {
      setError("");
      const response = await fetch(`${apiUrl}/api/employees/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Accès non autorisé");
      }
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Impossible de charger les rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("employeeToken");
    if (!token) {
      router.push("/employee/login");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const response = await fetch(`${apiUrl}/api/employees/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Impossible de créer le rendez-vous");
      }
      setForm({ firstName: "", lastName: "", phone: "", email: "", datetime: "" });
      setSuccess("Rendez-vous créé avec succès.");
      await loadAppointments();
    } catch (err) {
      setError(err.message || "Erreur lors de la création");
    }
  };

  const handleCancel = async (appointmentId) => {
    const token = localStorage.getItem("employeeToken");
    if (!token) {
      router.push("/employee/login");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const response = await fetch(`${apiUrl}/api/employees/appointments/${appointmentId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Impossible d'annuler le rendez-vous");
      }
      setSuccess("Rendez-vous annulé avec succès.");
      await loadAppointments();
    } catch (err) {
      setError(err.message || "Erreur lors de l'annulation");
    }
  };

  return (
    <div className={styles.pageShell}>
      <Navbar />
      <main className={styles.pageInner}>
        <section className={`${styles.heroCard} ${styles.grid}`}>
          <div className={styles.buttonRow} style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className={styles.eyebrow}>Tableau de bord</p>
              <h1 className={styles.pageTitle}>Gestion des rendez-vous</h1>
              <p className={styles.pageText}>Ajoutez un nouveau rendez-vous ou consultez les créneaux déjà enregistrés.</p>
            </div>
            <button className={styles.secondaryButton} onClick={() => {
              localStorage.removeItem("employeeToken");
              router.push("/employee/login");
            }}>
              Déconnexion
            </button>
          </div>

          {error ? <p className={styles.errorText}>{error}</p> : null}
          {success ? <p className={styles.successText}>{success}</p> : null}

          <div className={styles.panelCard}>
            <h2 className={styles.pageTitle} style={{ fontSize: "1.25rem" }}>Créer un rendez-vous</h2>
            <form onSubmit={handleCreate} className={styles.formGrid} style={{ marginTop: 16 }}>
              <input className={styles.input} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Prénom" required />
              <input className={styles.input} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Nom" required />
              <input className={styles.input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" required />
              <input className={styles.input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
              <input className={styles.input} type="datetime-local" value={form.datetime} onChange={(e) => setForm({ ...form, datetime: e.target.value })} required />
              <button className={styles.button} type="submit">Créer un rendez-vous</button>
            </form>
          </div>

          <div className={styles.panelCard}>
            <h2 className={styles.pageTitle} style={{ fontSize: "1.25rem" }}>Rendez-vous enregistrés</h2>
            {loading ? <p className={styles.pageText}>Chargement...</p> : null}
            <div className={styles.appointmentsGrid}>
              {appointments.map((appointment) => (
                <article key={appointment._id} className={styles.appointmentCard}>
                  <p className={styles.statusBadge}>{appointment.status === "confirmed" ? "Confirmé" : "En attente"}</p>
                  <p className={styles.appointmentTitle}>{appointment.firstName} {appointment.lastName}</p>
                  <p className={styles.appointmentMeta}>{appointment.phone}</p>
                  <p className={styles.appointmentMeta}>{appointment.email}</p>
                  <p className={styles.appointmentMeta}>{new Date(appointment.datetime).toLocaleString("fr-FR")}</p>
                  <div className={styles.buttonRow} style={{ marginTop: 12 }}>
                    <button className={styles.secondaryButton} onClick={() => handleCancel(appointment._id)}>
                      Annuler
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
