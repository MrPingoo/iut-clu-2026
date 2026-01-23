import { useState } from 'react';

const locations = [
  { id: 'ballroom', name: 'Salle de bal', class: 'room-ballroom' },
  { id: 'billiardroom', name: 'Billard', class: 'room-billiardroom' },
  { id: 'conservatory', name: 'Véranda', class: 'room-conservatory' },
  { id: 'diningroom', name: 'Salle à manger', class: 'room-diningroom' },
  { id: 'hall', name: 'Hall', class: 'room-hall' },
  { id: 'kitchen', name: 'Cuisine', class: 'room-kitchen' },
  { id: 'lounge', name: 'Salon', class: 'room-lounge' },
  { id: 'study', name: 'Bureau', class: 'room-study' },
  { id: 'library', name: 'Bibliothèque', class: 'room-library' }
];

const characters = [
  { id: 'red', name: 'Mlle Rose', class: 'character-red' },
  { id: 'blue', name: 'Colonel Moutarde', class: 'character-blue' },
  { id: 'white', name: 'Mme Leblanc', class: 'character-white' },
  { id: 'purple', name: 'Professeur Violet', class: 'character-purple' },
  { id: 'green', name: 'Révérend Olive', class: 'character-green' },
  { id: 'yellow', name: 'Mme Pervenche', class: 'character-yellow' }
];

const weapons = [
  { id: 'baton', name: 'Matraque', class: 'weapon-baton' },
  { id: 'gun', name: 'Revolver', class: 'weapon-gun' },
  { id: 'candle', name: 'Chandelier', class: 'weapon-candle' },
  { id: 'knife', name: 'Poignard', class: 'weapon-knife' },
  { id: 'rope', name: 'Corde', class: 'weapon-rope' },
  { id: 'spanner', name: 'Clé anglaise', class: 'weapon-spanner' }
];

function CardGrid({ selectedCards, onCardToggle }) {
  const handleCardClick = (type, id) => {
    onCardToggle(type, id);
  };

  const isSelected = (type, id) => {
    return selectedCards[type] === id;
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
              }`}
              onClick={() => handleCardClick('location', location.id)}
              title={location.name}
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
              }`}
              onClick={() => handleCardClick('character', character.id)}
              title={character.name}
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
              }`}
              onClick={() => handleCardClick('weapon', weapon.id)}
              title={weapon.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardGrid;
