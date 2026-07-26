"use client";

import React, { useState, useEffect } from "react";
import "./Rdv.css";

const Rdv = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
  });

  const [timeSlots] = useState([
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ]);

  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name === "date") {
      setFormData((prev) => ({ ...prev, time: "" }));
      setUnavailableSlots([]);
    }

    setErrorMsg("");
  };

  useEffect(() => {
    if (!formData.date) return;

    const fetchUnavailable = async () => {
      try {
        setIsChecking(true);

        const res = await fetch(`${backendUrl}/api/appointments`);
        if (!res.ok) {
          throw new Error(`Backend returned ${res.status}`);
        }
        const appointments = await res.json();

        const takenSlots = appointments
          .filter(
            (appt) =>
              new Date(appt.datetime).toLocaleDateString() ===
              new Date(formData.date).toLocaleDateString()
          )
          .map((appt) => {
            const d = new Date(appt.datetime);
            const h = d.getHours().toString().padStart(2, "0");
            const m = d.getMinutes().toString().padStart(2, "0");
            return `${h}:${m}`;
          });

        setUnavailableSlots(takenSlots);
      } catch (err) {
        console.error("Erreur de recuperation:", err);
        setErrorMsg("Le service de disponibilites est indisponible pour le moment.");
      } finally {
        setIsChecking(false);
      }
    };

    fetchUnavailable();
  }, [formData.date]);

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("Veuillez saisir le nom et le prenom.");
      return false;
    }

    const phoneRegex = /^\+?[\d\s\-]{6,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg("Veuillez saisir un numero de telephone valide.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Veuillez saisir une adresse mail valide.");
      return false;
    }

    if (!formData.date) {
      setErrorMsg("Veuillez selectionner une date.");
      return false;
    }

    if (!formData.time) {
      setErrorMsg("Veuillez choisir un horaire.");
      return false;
    }

    if (unavailableSlots.includes(formData.time)) {
      setErrorMsg("Le creneau selectionne n'est plus disponible.");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const datetimeStr = new Date(`${formData.date}T${formData.time}:00`).toISOString();

      const response = await fetch(`${backendUrl}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          datetime: datetimeStr,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Impossible de confirmer le rendez-vous.");
        return;
      }

      if (data.appointment?._id) {
        window.location.assign(`/success?appointmentId=${data.appointment._id}`);
        return;
      }

      throw new Error("Aucune confirmation de rendez-vous disponible.");
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur reseau. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="rdv">
      <div className="rdv-section">
        <p className="rdv-kicker">Reservation en ligne</p>
        <h2>Prendre rendez-vous</h2>

        <p className="rdv-help">
          Besoin d'aide pour le formulaire ? Nous vous accompagnons par telephone
          ou WhatsApp en francais ou en Darija.
        </p>

        <form className="rdv-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="firstName">Prenom *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Nom *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Telephone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="date">Date du rendez-vous *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="input-group">
            <label htmlFor="time">Horaire *</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={!formData.date || isChecking}
            >
              <option value="">Selectionnez un creneau</option>
              {timeSlots.map((slot) => (
                <option
                  key={slot}
                  value={slot}
                  disabled={unavailableSlots.includes(slot)}
                >
                  {slot} {unavailableSlots.includes(slot) ? "(Indisponible)" : ""}
                </option>
              ))}
            </select>

            {isChecking && <small>Verification des disponibilites...</small>}
          </div>

          {errorMsg && <p className="error-message">{errorMsg}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Traitement..." : "Réserver"}
          </button>
        </form>

        <p className="payment-info">Confirmation de rendez-vous par email.</p>
      </div>
    </section>
  );
};

export default Rdv;
