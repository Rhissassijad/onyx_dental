import React from 'react';
import './Emplacement.css';

const Emplacement = () => {
  return (
    <section className="emplacement-section" id="emplacement">
      <h2>Emplacement</h2>
      <div className="map-container">
        <iframe
          title="Carte Onyx Dental Office"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1409.1338198844426!2d-7.664342443317464!3d33.466148198294675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62f7336c0e865%3A0x6cef76f9f16c4b69!2sOnyx%20Dental%20Office%20-%20Bouskoura!5e0!3m2!1sfr!2sma!4v1747924045463!5m2!1sfr!2sma"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="address">
        Onyx Dental Office<br />
        4eme étage, Immeuble i Center, Lotissement Izdihar N°13<br />
        Bouskoura, Maroc
      </p>
    </section>
  );
};

export default Emplacement;
