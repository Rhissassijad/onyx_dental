import React from "react";
import "./Emplacement.css";

const Emplacement = () => {
  return (
    <section className="emplacement-section" id="emplacement">
      <div className="emplacement-header">
        <p>Nous trouver facilement</p>
        <h2>Emplacement et horaires</h2>
      </div>

      <div className="emplacement-content">
        <div className="emplacement-text">
          <div className="info-card">
            <h3>Adresse</h3>
            <p>
              <strong>Onyx Dental Office</strong>
              <br />
              4eme etage Immeuble i Center
              <br />
              Lotissement Izdihar N 13
              <br />
              Bouskoura, Maroc
            </p>
          </div>

          <div className="info-card">
            <h3>Contact</h3>
            <p>
              Telephone: <a href="tel:+212644745221">+212 6 44 74 52 21</a>
              <br />
              Email: <a href="mailto:onyxdental.casa@gmail.com">onyxdental.casa@gmail.com</a>
            </p>
          </div>

          <div className="info-card hours-card">
            <h3>Horaires sur rendez-vous</h3>
            <ul>
              <li>
                <span>Lundi - Vendredi</span>
                <strong>09:00 - 17:00</strong>
              </li>
              <li>
                <span>Samedi</span>
                <strong>09:00 - 13:00</strong>
              </li>
              <li>
                <span>Dimanche</span>
                <strong>Ferme</strong>
              </li>
            </ul>
          </div>

          <div className="location-actions">
            <a
              href="https://wa.me/212644745221"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a href="tel:+212644745221">Appeler</a>
          </div>
        </div>

        <div className="emplacement-map">
          <iframe
            title="Onyx Dental Office - Bouskoura"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1409.1338198844426!2d-7.664342443317464!3d33.466148198294675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62f7336c0e865%3A0x6cef76f9f16c4b69!2sOnyx%20Dental%20Office%20-%20Bouskoura!5e0!3m2!1sfr!2sma!4v1747924045463!5m2!1sfr!2sma"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Emplacement;
