import { useState } from 'react';
import { ROOMS, CHARACTERS, WEAPONS } from '../config/boardConfig';

const locations = [
  { id: 'Cuisine', name: 'Cuisine', class: 'room-kitchen' },
  { id: 'Salle de billard', name: 'Billard', class: 'room-billiardroom' },
  { id: 'Bibliothèque', name: 'Bibliothèque', class: 'room-library' },
  { id: 'Véranda', name: 'Véranda', class: 'room-conservatory' },
  { id: 'Salle à manger', name: 'Salle à manger', class: 'room-diningroom' },
  { id: 'Salon', name: 'Salon', class: 'room-lounge' },
  { id: 'Hall', name: 'Hall', class: 'room-hall' },
  { id: 'Bureau', name: 'Bureau', class: 'room-study' },
  { id: 'Studio', name: 'Studio', class: 'room-ballroom' }
];

const characters = [
  { id: 'Mademoiselle Rose', name: 'Mlle Rose', class: 'character-red' },
  { id: 'Colonel Moutarde', name: 'Col. Moutarde', class: 'character-blue' },
  { id: 'Madame Leblanc', name: 'Mme Leblanc', class: 'character-white' },
  { id: 'Professeur Violet', name: 'Prof. Violet', class: 'character-purple' },
  { id: 'Révérend Olive', name: 'Rév. Olive', class: 'character-green' },
  { id: 'Docteur Lenoir', name: 'Dr. Lenoir', class: 'character-yellow' }
];

const weapons = [
  { id: 'Matraque', name: 'Matraque', class: 'weapon-baton' },
  { id: 'Revolver', name: 'Revolver', class: 'weapon-gun' },
  { id: 'Chandelier', name: 'Chandelier', class: 'weapon-candle' },
  { id: 'Poignard', name: 'Poignard', class: 'weapon-knife' },
  { id: 'Corde', name: 'Corde', class: 'weapon-rope' },
  { id: 'Clé anglaise', name: 'Clé anglaise', class: 'weapon-spanner' }
];

function CardGrid({ selectedCards, onCardToggle, playerCards = [] }) {
  const handleCardClick = (type, id) => {
    onCardToggle(type, id);
  };

  const isSelected = (type, id) => {
    return selectedCards[type] === id;
  };

  const hasCard = (cardName) => {
    return playerCards.includes(cardName);
  };

  return (
    <div className="cards-grid">
      <div className="card-section">
        <h2>Lieux</h2>
        <div className="grid locations-grid">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`card-bubble ${location.class} ${
                isSelected('location', location.id) ? 'selected' : ''
              } ${hasCard(location.id) ? 'player-card' : ''}`}
              onClick={() => handleCardClick('location', location.id)}
              title={`${location.name}${hasCard(location.id) ? ' (Votre carte)' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="card-section">
        <h2>Personnages</h2>
        <div className="grid characters-grid">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`card-bubble ${character.class} ${
                isSelected('character', character.id) ? 'selected' : ''
              } ${hasCard(character.id) ? 'player-card' : ''}`}
              onClick={() => handleCardClick('character', character.id)}
              title={`${character.name}${hasCard(character.id) ? ' (Votre carte)' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="card-section">
        <h2>Armes</h2>
        <div className="grid weapons-grid">
          {weapons.map((weapon) => (
            <div
              key={weapon.id}
              className={`card-bubble ${weapon.class} ${
                isSelected('weapon', weapon.id) ? 'selected' : ''
              } ${hasCard(weapon.id) ? 'player-card' : ''}`}
              onClick={() => handleCardClick('weapon', weapon.id)}
              title={`${weapon.name}${hasCard(weapon.id) ? ' (Votre carte)' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardGrid;
