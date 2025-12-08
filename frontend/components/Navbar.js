import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          Onyx Dental Office
        </div>
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#presentation" onClick={closeMobileMenu}>Présentation</a>
          <a href="#equipe" onClick={closeMobileMenu}>Équipe</a>
          <a href="#galerie" onClick={closeMobileMenu}>Galerie</a>
          <a href="#emplacement" onClick={closeMobileMenu}>Emplacement</a>
          <a href="#contacts" onClick={closeMobileMenu}>Contacts</a>
        </div>
        <div className="menu-icon" onClick={toggleMobileMenu} aria-label="Toggle menu" role="button" tabIndex={0} onKeyPress={(e) => {if(e.key === 'Enter') toggleMobileMenu()}}>
          <div className={`bar1 ${isMobileMenuOpen ? 'change' : ''}`}></div>
          <div className={`bar2 ${isMobileMenuOpen ? 'change' : ''}`}></div>
          <div className={`bar3 ${isMobileMenuOpen ? 'change' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
