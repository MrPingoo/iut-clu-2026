import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DicePopup from '../components/DicePopup';
import CardGrid from '../components/CardGrid';
import ChatZone from '../components/ChatZone';
import '../styles/game.css';

function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Bienvenue dans Clue !', type: 'system' }
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
      const response = await fetch(`http://localhost:8000/api/games/${gameId}`, {
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
      const response = await fetch('http://localhost:8000/api/games', {
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
    addMessage(`🎲 Dé lancé : ${result}`, 'system');
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
        const response = await fetch(`http://localhost:8000/api/games/${id}/move`, {
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
  };

  return (
    <div className="container">
      <h1 className="logo">CLUEDO</h1>

      <div className="main-content">
        {/* Section gauche: Plateau de jeu */}
        <div className="game-section">
          <div className="board-container">
            <img
              src="/assets/images/board.jpg"
              alt="Plateau de Clue"
              className="game-board"
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
