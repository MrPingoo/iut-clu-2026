import { CHARACTERS } from '../config/boardConfig';
import '../styles/characterSelector.css';

function CharacterSelector({ selectedCharacter, onSelect }) {
  return (
    <div className="character-selector">
      <h3>Sélectionnez votre personnage</h3>
      <div className="character-grid">
        {Object.entries(CHARACTERS).map(([, character]) => (
          <button
            key={character.id}
            className={`character-card ${selectedCharacter === character.id ? 'selected' : ''}`}
            onClick={() => onSelect(character.id)}
            style={{
              '--character-color': character.color,
              borderColor: selectedCharacter === character.id ? '#ffd700' : character.color
            }}
          >
            <div
              className="character-icon"
              style={{ backgroundColor: character.color }}
            >
              {character.name.charAt(0)}
            </div>
            <span className="character-name">{character.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CharacterSelector;
