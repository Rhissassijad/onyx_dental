import React, { useState } from "react";
import "./Presentation.css";

const presentationImages = [
  { src: "/Cabinet.jpeg", alt: "Cabinet dentaire" },
  { src: "/Cabinet2.jpeg", alt: "Cabinet dentaire" },
  { src: "/Salle.jpeg", alt: "Salle d'attente" },
  { src: "/Appareil.JPG", alt: "Appareil" },
];

const services = [
  {
    title: "Soins et prevention",
    description: "Detartrage, controle et conseils clairs pour garder des dents saines.",
  },
  {
    title: "Prothèse",
    description: "Harmonisation et traitements adaptés a votre profil.",
  },
  {
    title : "Esthétique du sourire",
    description : "Blanchiment",
  },
  {
    title: "Urgences dentaires",
    description: "Prise en charge rapide pour la douleur, ou traumatismes.",
  },
];

const Presentation = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const showPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? presentationImages.length - 1 : prev - 1));
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev === presentationImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="presentation-section" id="presentation">
      <div className="presentation-content">
        <div className="presentation-text">
          <p className="eyebrow">Cabinet dentaire moderne a Bouskoura</p>

          <p className="CardTitle">Soins dentaires professionnels, personalisés et rassurants</p>

          <p className="lead">
            Bienvenue chez Onyx Dental Office, votre centre dentaire a Bouskoura, Izdihar. Nous vous accueillons 
            dans un cadre convivial et professionnel. Notre équipe vous propose des soins dentaires pour vous et votre famille 
            grâce a une approche personnalisée adaptée à vos besoins dans un cadre agréable et apaisant dans les meilleures conditions de confort et d'asepsie. 
            Chez Onyx Dental Office, adultes comme enfants sont accompagnés avec une approche humaine,
            des technologies modernes et un suivi attentif.
          </p>

          

          <div className="presentation-buttons">
            <a
              href="https://wa.me/212644745221?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <img src="/whatsapp.png" alt="" className="btn-icon" />
              <span>WhatsApp</span>
            </a>
            <a href="tel:+212644745221" className="btn btn-call">
              <img src="/tel.png" alt="" className="btn-icon" />
              <span>Appeler</span>
            </a>
            <a href="#rdv" className="btn btn-rdv">
              Prendre rendez-vous
            </a>
          </div>
        </div>

        <div className="presentation-image">
          <div className="presentation-image-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {presentationImages.map((image, index) => (
              <div key={`${image.src}-${index}`} className="presentation-image-slide">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </div>
            ))}
          </div>

          <button type="button" className="presentation-nav presentation-nav-prev" onClick={showPrevious} aria-label="Image précédente">
            ‹
          </button>
          <button type="button" className="presentation-nav presentation-nav-next" onClick={showNext} aria-label="Image suivante">
            ›
          </button>
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
