import React, { useState, useEffect } from 'react';
import './Rdv.css';

const Rdv = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
  });
  const [timeSlots, setTimeSlots] = useState([
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
  ]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Backend URL - à adapter selon déploiement
  const backendUrl = 'http://localhost:4000';

  // Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'date') {
      setFormData(prev => ({ ...prev, time: '' })); // Reset time when date changes
      setUnavailableSlots([]);
    }
    setErrorMsg('');
  };

  // Check availability for chosen date and time slot
  useEffect(() => {
    const fetchUnavailable = async () => {
      if (!formData.date) return;
      try {
        setIsChecking(true);
        // Fetch all appointments for the date and mark unavailable time slots
        const res = await fetch(`${backendUrl}/api/appointments`);
        const appointments = await res.json();
        const takenSlots = appointments
          .filter(appt => new Date(appt.datetime).toLocaleDateString() === new Date(formData.date).toLocaleDateString())
          .map(appt => {
            const d = new Date(appt.datetime);
            const h = d.getHours().toString().padStart(2, '0');
            const m = d.getMinutes().toString().padStart(2, '0');
            return `${h}:${m}`;
          });
        setUnavailableSlots(takenSlots);
      } catch (err) {
        console.error("Erreur pour récupérer disponibilités:", err);
      } finally {
        setIsChecking(false);
      }
    };
    fetchUnavailable();
  }, [formData.date]);

  // Form validation
  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg('Veuillez saisir le nom et le prénom.');
      return false;
    }
    const phoneRegex = /^\+?[\d\s\-]{6,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg('Veuillez saisir un numéro de téléphone valide.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('Veuillez saisir une adresse mail valide.');
      return false;
    }
    if (!formData.date) {
      setErrorMsg('Veuillez sélectionner une date.');
      return false;
    }
    if (!formData.time) {
      setErrorMsg('Veuillez choisir un horaire.');
      return false;
    }
    if (unavailableSlots.includes(formData.time)) {
      setErrorMsg('Le créneau sélectionné n\'est plus disponible.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      // Compose datetime ISO string from date + time
      const datetimeStr = new Date(`${formData.date}T${formData.time}:00`).toISOString();

      // Create Stripe Checkout session via backend
      const response = await fetch(`${backendUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          datetime: datetimeStr,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Redirect to Stripe Checkout
        const stripePublicKey = 'pk_test_51NsU3hF2QzFZlqNZ4I2s7fXmCgY41NFGWxdzcf1WTYGCci3iyO3QSvVUz2cbDoo6FYudQ7bS3dhhvYdK0mNueEM9T00xFWelT8X'; // Replace by your public key
        const stripeJs = await import('@stripe/stripe-js');
        const stripe = await stripeJs.loadStripe(stripePublicKey);
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        setErrorMsg(data.error || "Erreur lors de la création du paiement.");
      }
    } catch (err) {
      setErrorMsg("Erreur réseau, veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rdv-section" id="rdv">
      <h2>Prise de Rendez-Vous</h2>
      <form className="rdv-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="firstName">Prénom *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
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
            autoComplete="family-name"
          />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Numéro de téléphone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Adresse mail *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="exemple@exemple.com"
            autoComplete="email"
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
            min={new Date().toISOString().split('T')[0]}
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
            <option value="">-- Sélectionnez un créneau --</option>
            {timeSlots.map(slot => (
              <option
                key={slot}
                value={slot}
                disabled={unavailableSlots.includes(slot)}
              >
                {slot} {unavailableSlots.includes(slot) ? '(Indisponible)' : ''}
              </option>
            ))}
          </select>
          {isChecking && <small>Vérification des disponibilités...</small>}
        </div>
        {errorMsg && <p className="error-message" role="alert">{errorMsg}</p>}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Traitement...' : 'Réserver et payer'}
        </button>
      </form>
      <p className="payment-info">
        Le paiement sécurisé est géré via Stripe.
      </p>
    </section>
  );
};

export default Rdv;
