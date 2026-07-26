import React, { useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);

  const showPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="galerie-section" id="galerie">
      <div className="galerie-header">
        <h2>Galerie</h2>
        <p>Parcourez notre espace et découvrez l’ambiance du cabinet.</p>
      </div>

      <div className="gallery-carousel">
        <button
          type="button"
          className="gallery-nav gallery-nav-prev"
          onClick={showPrevious}
          aria-label="Image précédente"
        >
          ‹
        </button>

        <div className="gallery-viewport">
          <div
            className="gallery-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={`${img.src}-${index}`} className="gallery-slide">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="gallery-nav gallery-nav-next"
          onClick={showNext}
          aria-label="Image suivante"
        >
          ›
        </button>
      </div>

      <div className="gallery-dots" role="tablist" aria-label="Choisir une image">
        {images.map((img, index) => (
          <button
            key={`${img.src}-dot`}
            type="button"
            className={`gallery-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Voir ${img.alt}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Galerie;
