import React from 'react';
import './Equipe.css';

// Example team data can be replaced by props or fetched data
const teamMembers = [
  {
    name: 'Mounia Chafai el Alaoui',
    role: 'Chirurgien-dentiste',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Jean Dupont',
    role: 'Assistant dentaire',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Sophie Martin',
    role: 'Hygiéniste dentaire',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

const Equipe = () => {
  return (
    <section className="equipe-section" id="equipe">
      <h2>Notre Équipe</h2>
      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member-card">
            <img
              src={member.photo}
              alt={`Photo de ${member.name}`}
              className="team-member-photo"
            />
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Equipe;
