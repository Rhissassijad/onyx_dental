import React from 'react';
import './Galerie.css';

const images = [
  { src: 'https://images.unsplash.com/photo-1588776814546-3f0b77b9d7e0?auto=format&fit=crop&w=800&q=60', alt: 'Salle d\'attente' },
  { src: 'https://images.unsplash.com/photo-1576765607926-81f4c953ae1e?auto=format&fit=crop&w=800&q=60', alt: 'Cabinet dentaire moderne' },
  { src: 'https://images.unsplash.com/photo-1509474520651-38dc94f95e6a?auto=format&fit=crop&w=800&q=60', alt: 'Instruments dentaires' },
  { src: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=60', alt: 'Dentiste en consultation' },
  { src: 'https://images.unsplash.com/photo-1588776814625-5d73590264e3?auto=format&fit=crop&w=800&q=60', alt: 'Salle de soins' },
  { src: 'https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=800&q=60', alt: 'Équipement dentaire' },
];

const Galerie = () => {
  return (
    <section className="galerie-section" id="galerie">
      <h2>Galerie</h2>
      <div className="gallery-grid">
        {images.map((img, index) => (
          <div key={index} className="gallery-item">
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Galerie;
