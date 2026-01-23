import { useState, useEffect, useRef } from 'react';

const locations = {
  'ballroom': 'Salle de bal',
  'billiardroom': 'Billard',
  'conservatory': 'Véranda',
  'diningroom': 'Salle à manger',
  'hall': 'Hall',
  'kitchen': 'Cuisine',
  'lounge': 'Salon',
  'study': 'Bureau',
  'library': 'Bibliothèque'
};

const characters = {
  'red': 'Mlle Rose',
  'blue': 'Colonel Moutarde',
  'white': 'Mme Leblanc',
  'purple': 'Professeur Violet',
  'green': 'Révérend Olive',
  'yellow': 'Mme Pervenche'
};

const weapons = {
  'baton': 'Matraque',
  'gun': 'Revolver',
  'candle': 'Chandelier',
  'knife': 'Poignard',
  'rope': 'Corde',
  'spanner': 'Clé anglaise'
};

function ChatZone({ messages, onValidate, onDiceClick }) {
  const [locationSelect, setLocationSelect] = useState('');
  const [characterSelect, setCharacterSelect] = useState('');
  const [weaponSelect, setWeaponSelect] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleValidate = () => {
    if (!locationSelect || !characterSelect || !weaponSelect) {
      return;
    }

    const locationName = locations[locationSelect];
    const characterName = characters[characterSelect];
    const weaponName = weapons[weaponSelect];

    onValidate(locationName, characterName, weaponName);

    // Réinitialiser les sélections
    setLocationSelect('');
    setCharacterSelect('');
    setWeaponSelect('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleValidate();
    }
  };

  return (
    <div className="chat-controls">
      <div className="chat-zone">
        <div className="chat-header">
          <h3>Messages</h3>
          <button className="dice-button" onClick={onDiceClick}>
            <span className="dice-icon">🎲</span>
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <p key={index} className={`chat-message ${message.type}`}>
              {message.text}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <select
            className="game-select"
            value={locationSelect}
            onChange={(e) => setLocationSelect(e.target.value)}
            onKeyPress={handleKeyPress}
          >
            <option value="">Lieu...</option>
            {Object.entries(locations).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>

          <select
            className="game-select"
            value={characterSelect}
            onChange={(e) => setCharacterSelect(e.target.value)}
            onKeyPress={handleKeyPress}
          >
            <option value="">Personnage...</option>
            {Object.entries(characters).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>

          <select
            className="game-select"
            value={weaponSelect}
            onChange={(e) => setWeaponSelect(e.target.value)}
            onKeyPress={handleKeyPress}
          >
            <option value="">Arme...</option>
            {Object.entries(weapons).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>

          <button className="validate-button" onClick={handleValidate}>
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatZone;
