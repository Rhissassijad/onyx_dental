"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "@/components/portalPage.module.css";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/employees/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Identifiants invalides");
      }

      localStorage.setItem("employeeToken", data.token);
      router.push("/employee/dashboard");
    } catch (err) {
      setError(err.message || "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageShell}>
      <Navbar />
      <main className={styles.pageInner}>
        <section className={`${styles.heroCard} ${styles.grid}`} style={{ maxWidth: 560, margin: "0 auto" }}>
          <div>
            <p className={styles.eyebrow}>Espace employé</p>
            <h1 className={styles.pageTitle}>Connexion employé</h1>
            <p className={styles.pageText}>Accédez au tableau de bord pour gérer les rendez-vous du cabinet.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nom d'utilisateur" required />
            <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
