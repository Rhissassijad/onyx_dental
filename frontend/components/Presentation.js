import React from "react";
import "./Presentation.css";

const services = [
  {
    title: "Soins de prevention",
    description: "Detartrage, controle et conseils clairs pour garder des dents saines.",
  },
  {
    title: "Esthetique du sourire",
    description: "Blanchiment, harmonisation et traitements adaptes a votre profil.",
  },
  {
    title: "Urgences dentaires",
    description: "Prise en charge rapide pour douleur, infection ou dent cassee.",
  },
];

const Presentation = () => {
  return (
    <section className="presentation-section" id="presentation">
      <div className="presentation-content">
        <div className="presentation-text">
          <p className="eyebrow">Cabinet dentaire moderne a Bouskoura</p>

          <h1>Des soins dentaires professionnels, simples et rassurants</h1>

          <p className="lead">
            Chez Onyx Dental Office, chaque etape est expliquee simplement. Notre
            equipe accompagne les adultes et les enfants avec une approche humaine,
            des technologies modernes et un suivi attentif.
          </p>

          <div className="trust-pills">
            <span>Paiement securise</span>
            <span>Assistance WhatsApp</span>
            <span>Accompagnement en francais</span>
          </div>

          <div className="presentation-buttons">
            <a
              href="https://wa.me/212644745221?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Ecrire sur WhatsApp
            </a>
            <a href="#rdv" className="btn btn-rdv">
              Prendre rendez-vous
            </a>
            <a href="tel:+212644745221" className="btn btn-call">
              Appeler le cabinet
            </a>
          </div>
        </div>

        <div className="presentation-image">
          <img src="/Cabinet.jpeg" alt="Images du cabinet" />
        </div>
      </div>

      <div className="services-grid" id="services">
        {services.map((service) => (
          <article key={service.title} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Presentation;
