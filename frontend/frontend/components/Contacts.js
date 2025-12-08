import React from 'react';
import './Contacts.css';
const Contacts = () => {
  return (
    <section className="contacts-section" id="contacts">
      <h2>Contacts</h2>
      <div className="contact-info">
        <p><strong>Numéro de téléphone :</strong> <a href="tel:+212644745221">0644745221</a></p>
        <p><strong>Adresse :</strong> Immeuble i Center, Lotissement Izdihar N°13, Bouskoura, Maroc</p>
        <p><strong>Étage :</strong> 4ème étage</p>
        <p><strong>Email :</strong> <a href="mailto:onyxdental.casa@gmail.com">onyxdental.casa@gmail.com</a></p>
      </div>
    </section>
  );
};
export default Contacts;