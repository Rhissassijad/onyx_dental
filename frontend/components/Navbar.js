"use client";

import React, { useState } from "react";
import "./Navbar.css";

const navItems = [
  { href: "#presentation", label: "Accueil" },
  { href: "#services", label: "Soins" },
  { href: "#emplacement", label: "Localisation" },
  { href: "#rdv", label: "Rendez-vous" },
  { href: "#contacts", label: "Contact" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar" id="top">
      <div className="navbar-topnote">Cabinet dentaire moderne a Bouskoura</div>

      <div className="navbar-container">
        <a href="#presentation" className="brand" onClick={closeMobileMenu}>
          <img src="/Logo.png" alt="Onyx Dental Office" />
          <div>
            <p>Onyx Dental Office</p>
            <span>Bouskoura, Maroc</span>
          </div>
        </a>

        <button
          className={`menu-icon ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Ouvrir le menu"
          aria-expanded={isMobileMenuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-panel ${isMobileMenuOpen ? "active" : ""}`}>
          <nav className="nav-links" aria-label="Navigation principale">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMobileMenu}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a
              href="https://wa.me/212644745221?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="action-btn whatsapp"
            >
              WhatsApp
            </a>
            <a
              href="tel:+212644745221"
              onClick={closeMobileMenu}
              className="action-btn call"
            >
              Appeler
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
