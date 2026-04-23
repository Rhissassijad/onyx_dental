import React from "react";
import "./Contacts.css";

const Contacts = () => {
  return (
    <section className="contacts-section" id="contacts">
      <div className="contacts-shell">
        <h2>Contact rapide</h2>

        <div className="contact-grid">
          <a className="contact-card" href="tel:+212644745221">
            <h3>Telephone</h3>
            <p>+212 6 44 74 52 21</p>
          </a>

          <a
            className="contact-card"
            href="https://wa.me/212644745221"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>WhatsApp</h3>
            <p>Reponse rapide du cabinet</p>
          </a>

          <a className="contact-card" href="mailto:onyxdental.casa@gmail.com">
            <h3>Email</h3>
            <p>onyxdental.casa@gmail.com</p>
          </a>
        </div>

        <p className="footer-address">
          Onyx Dental Office, 4eme etage Immeuble i Center, Lotissement Izdihar
          N 13, Bouskoura, Maroc
        </p>
      </div>
    </section>
  );
};

export default Contacts;
