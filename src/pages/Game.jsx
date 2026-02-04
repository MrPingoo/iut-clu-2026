import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import CharacterSelector from '../components/CharacterSelector';
import DicePopup from '../components/DicePopup';
import CardGrid from '../components/CardGrid';
import ChatZone from '../components/ChatZone';
import { CHARACTERS } from '../config/boardConfig';
import '../styles/game.css';

function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([
    { text: 'Bienvenue dans Clue !', type: 'system' },
    { text: '🎯 Sélectionnez un personnage pour commencer', type: 'system' }
  ]);
  const [selectedCards, setSelectedCards] = useState({
    location: null,
    character: null,
    weapon: null
  });

  useEffect(() => {
    if (id) {
      loadGame(id);
    } else {
      createNewGame();
    }
  }, [id]);

  const loadGame = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/games/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la partie');
      }

      const data = await response.json();
      console.log('Partie chargée:', data);
    } catch (err) {
      console.log('Mode développement - nouvelle partie');
    }
  };

  const createNewGame = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/games', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: 'Colonel Moutarde'
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la partie');
      }

      const data = await response.json();
      navigate(`/game/${data.id}`, { replace: true });
    } catch (err) {
      console.log('Mode développement - partie locale');
    }
  };

  const handleDiceRoll = (result) => {
    setDiceResult(result);
    addMessage(`🎲 Dé lancé : ${result}`, 'system');
    if (selectedCharacter) {
      addMessage(`Cliquez sur une case verte pour déplacer ${CHARACTERS[Object.keys(CHARACTERS).find(k => CHARACTERS[k].id === selectedCharacter)]?.name}`, 'system');
    } else {
      addMessage('⚠️ Veuillez d\'abord sélectionner un personnage', 'system');
    }
  };

  const handleValidate = async (location, character, weapon) => {
    if (!location || !character || !weapon) {
      addMessage('⚠️ Veuillez sélectionner un lieu, un personnage et une arme', 'system');
      return;
    }

    const hypothesis = `🔍 Hypothèse : ${character} dans ${location} avec ${weapon}`;
    addMessage(hypothesis, 'user');

    if (id) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/games/${id}/move`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ location, character, weapon }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la validation');
        }

        const data = await response.json();
        if (data.message) {
          addMessage(data.message, 'system');
        }
      } catch (err) {
        console.log('Mode développement - hypothèse enregistrée localement');
      }
    }
  };

  const addMessage = (text, type = 'user') => {
    setMessages(prev => [...prev, { text, type }]);
  };

  const handleCardToggle = (cardType, value) => {
    setSelectedCards(prev => ({
      ...prev,
      [cardType]: prev[cardType] === value ? null : value
    }));

    // Si c'est un personnage, le sélectionner pour le plateau
    if (cardType === 'character') {
      const characterKey = Object.keys(CHARACTERS).find(
        key => CHARACTERS[key].name === value
      );
      if (characterKey) {
        setSelectedCharacter(CHARACTERS[characterKey].id);
        addMessage(`👤 Personnage sélectionné : ${value}`, 'system');
        addMessage('🎲 Lancez les dés pour voir les mouvements possibles', 'system');
      }
    }
  };

  const handleMoveComplete = (moveInfo) => {
    const { character, room } = moveInfo;
    if (room) {
      addMessage(`✅ ${character} est entré(e) dans ${room}`, 'system');
      setSelectedCards(prev => ({
        ...prev,
        location: room
      }));
    } else {
      addMessage(`✅ ${character} s'est déplacé(e)`, 'system');
    }
    // Réinitialiser le résultat des dés après le déplacement
    setDiceResult(null);
  };

  return (
    <div className="container">
      <h1 className="logo">CLUEDO</h1>

      <div className="main-content">
        {/* Section gauche: Plateau de jeu */}
        <div className="game-section">
          <CharacterSelector
            selectedCharacter={selectedCharacter}
            onSelect={(charId) => {
              setSelectedCharacter(charId);
              const char = Object.values(CHARACTERS).find(c => c.id === charId);
              if (char) {
                addMessage(`👤 ${char.name} sélectionné(e)`, 'system');
                addMessage('🎲 Lancez les dés pour commencer', 'system');
              }
            }}
          />
          <div className="board-container">
            <Board
              selectedCharacter={selectedCharacter}
              diceResult={diceResult}
              onMoveComplete={handleMoveComplete}
            />
          </div>
        </div>

        {/* Section droite: Contrôles */}
        <div className="controls-section">
          <CardGrid
            selectedCards={selectedCards}
            onCardToggle={handleCardToggle}
          />

          <ChatZone
            messages={messages}
            onValidate={handleValidate}
            onDiceClick={() => setShowDicePopup(true)}
          />
        </div>
      </div>

      <DicePopup
        isOpen={showDicePopup}
        onClose={() => setShowDicePopup(false)}
        onRoll={handleDiceRoll}
      />
    </div>
  );
}

export default Game;
