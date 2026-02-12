import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BoardCSS from '../components/BoardCSS';
import CharacterSelector from '../components/CharacterSelector';
import DicePopup from '../components/DicePopup';
import CardGrid from '../components/CardGrid';
import ChatZone from '../components/ChatZone';
import { CHARACTERS } from '../config/boardConfig';
import { MovementController } from '../utils/pathfinding';
import gameManager from '../services/gameManager';
import chatGPTService from '../services/chatgpt';
import '../styles/game.css';

function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [playerCharacter, setPlayerCharacter] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { text: 'Bienvenue dans Clue !', type: 'system' }
  ]);
  const [selectedCards, setSelectedCards] = useState({
    location: [],
    character: [],
    weapon: []
  });
  const [playerCards, setPlayerCards] = useState([]);

  useEffect(() => {
    const initGame = async () => {
      console.log('Game component mounted, id:', id);
      setLoading(true);

      if (id) {
        await loadGame(id);
      } else {
        initializeNewGame();
      }

      setLoading(false);
    };

    initGame();
  }, [id]);

  const initializeNewGame = () => {
    console.log('Initializing new game...');

    // Initialiser le jeu avec le GameManager
    const { playerCharacter: player, gameState: state } = gameManager.initializeGame();

    console.log('Game initialized:', { player, state });

    setPlayerCharacter(player);
    setSelectedCharacter(player.id);
    setGameState(state);
    setIsPlayerTurn(gameManager.isPlayerTurn());
    setPlayerCards(gameManager.getPlayerCards());

    addMessage(`🎮 Vous incarnez ${player.name} !`, 'system');
    addMessage(`🃏 Vous avez ${gameManager.getPlayerCards().length} cartes`, 'system');
    addMessage('📋 Vos cartes: ' + gameManager.getPlayerCards().join(', '), 'system');
    addMessage('🎲 Lancez les dés pour commencer votre tour', 'system');

    console.log('gameState set:', state);
  };

  const loadGame = async (gameId) => {
    console.log('Loading game:', gameId);
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');

      const response = await fetch(`http://localhost:8080/api/games/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la partie');
      }

      const data = await response.json();
      console.log('Game data from API:', data);

      // Charger l'état sauvegardé
      if (data.state) {
        gameManager.loadGame(data.state);
        const state = gameManager.getGameState();
        const player = gameManager.getPlayerCharacter();

        setPlayerCharacter(player);
        setSelectedCharacter(player.id);
        setGameState(state);
        setIsPlayerTurn(gameManager.isPlayerTurn());
        setPlayerCards(gameManager.getPlayerCards());

        addMessage('✅ Partie chargée avec succès', 'system');
      } else {
        console.log('No state in response, initializing new game');
        initializeNewGame();
      }
    } catch (err) {
      console.error('Error loading game:', err);
      console.log('Impossible de charger la partie, nouvelle partie initialisée');
      initializeNewGame();
    }
  };

  const handleDiceRoll = async (result) => {
    setDiceResult(result);

    if (!isPlayerTurn) {
      addMessage('⚠️ Ce n\'est pas votre tour !', 'system');
      setDiceResult(null);
      return;
    }

    addMessage(`🎲 Vous avez lancé ${result}`, 'user');
    addMessage(`Cliquez sur une case verte pour déplacer ${playerCharacter.name}`, 'system');
  };

  const playAITurn = async () => {
    const currentChar = gameManager.getGameState().characters[gameManager.getGameState().currentTurn];

    if (!currentChar || !currentChar.isAI) {
      return;
    }

    addMessage(`🤖 ${currentChar.name} réfléchit...`, 'system');

    // Lancer les dés pour l'IA
    await new Promise(resolve => setTimeout(resolve, 1000));
    const aiDiceResult = Math.floor(Math.random() * 11) + 2; // 2-12

    addMessage(`🎲 ${currentChar.name} lance les dés: ${aiDiceResult}`, 'system');

    // Calculer les mouvements possibles
    const movementController = new MovementController({
      width: 24,
      height: 24,
      grid: gameManager.getGameState().grid.map(row =>
        row.map(cell => {
          if (cell === 0) return 'empty';
          if (cell === 1) return 'wall';
          if (cell === 2) return 'door';
          if (cell >= 3 && cell <= 11) return 'room';
          return 'wall';
        })
      )
    });

    const possibleMoves = movementController.obtenirMouvementsPossibles(currentChar, aiDiceResult);

    // Demander à l'IA de jouer
    await new Promise(resolve => setTimeout(resolve, 1500));
    const decision = await gameManager.playAITurn(currentChar.id, aiDiceResult, possibleMoves);

    if (decision && decision.action === 'move' && decision.target) {
      // Déplacer le personnage
      const moveResult = gameManager.moveCharacter(currentChar.id, decision.target);

      // Mettre à jour l'affichage
      setGameState({...gameManager.getGameState()});

      addMessage(`✅ ${currentChar.name} se déplace ${decision.reasoning ? ': ' + decision.reasoning : ''}`, 'system');

      if (moveResult.room) {
        addMessage(`📍 ${currentChar.name} entre dans ${moveResult.room}`, 'system');
      }
    }

    // Passer au tour suivant
    await new Promise(resolve => setTimeout(resolve, 1000));
    nextTurn();
  };

  const nextTurn = () => {
    const nextChar = gameManager.nextTurn();
    setGameState({...gameManager.getGameState()});
    setIsPlayerTurn(gameManager.isPlayerTurn());

    if (gameManager.isPlayerTurn()) {
      addMessage(`🎯 C'est votre tour ! Lancez les dés`, 'system');
    } else {
      addMessage(`⏳ Tour de ${nextChar.name}`, 'system');
      // Jouer le tour de l'IA après un délai
      setTimeout(() => playAITurn(), 1000);
    }
  };

  const handleValidate = async (location, character, weapon) => {
    if (!location || !character || !weapon) {
      addMessage('⚠️ Veuillez sélectionner un lieu, un personnage et une arme', 'system');
      return;
    }

    if (!isPlayerTurn) {
      addMessage('⚠️ Ce n\'est pas votre tour !', 'system');
      return;
    }

    const hypothesis = { location, character, weapon };
    addMessage(`🔍 Vous suggérez : ${character} dans ${location} avec ${weapon}`, 'user');

    // Faire l'hypothèse via le GameManager
    const result = gameManager.makeHypothesis(playerCharacter.id, hypothesis);

    if (result.refuted) {
      addMessage(`❌ ${result.refutedBy} vous montre discrètement la carte : ${result.cardShown}`, 'system');

      // Ajouter la carte montrée aux cartes connues du joueur si elle n'y est pas déjà
      if (result.cardShown && !playerCards.includes(result.cardShown)) {
        setPlayerCards(prev => [...prev, result.cardShown]);
      }
    } else {
      addMessage(`✅ Personne ne peut réfuter votre hypothèse !`, 'system');
    }

    // Sauvegarder via l'API si connecté
    if (id) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:8080/api/games/${id}/move`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location,
            character,
            weapon,
            state: gameManager.saveGame()
          }),
        });
      } catch (err) {
        console.log('Sauvegarde locale uniquement');
      }
    }

    // Passer au tour suivant après un délai
    setTimeout(() => nextTurn(), 2000);
  };

  const addMessage = (text, type = 'user') => {
    setMessages(prev => [...prev, { text, type }]);
  };

  const handleCardToggle = (cardType, value) => {
    setSelectedCards(prev => {
      const currentSelection = prev[cardType];
      const isCurrentlySelected = currentSelection.includes(value);

      return {
        ...prev,
        [cardType]: isCurrentlySelected
          ? currentSelection.filter(item => item !== value)
          : [...currentSelection, value]
      };
    });
  };

  const handleMoveComplete = (moveInfo) => {
    const { character, room, position } = moveInfo;

    // Mettre à jour la position dans le GameManager
    if (gameState && position) {
      gameManager.moveCharacter(selectedCharacter, position);
      setGameState({...gameManager.getGameState()});
    }

    if (room) {
      addMessage(`✅ Vous entrez dans ${room}`, 'user');
      setSelectedCards(prev => ({
        ...prev,
        location: prev.location.includes(room) ? prev.location : [...prev.location, room]
      }));

      addMessage(`💡 Vous pouvez maintenant faire une hypothèse`, 'system');
    } else {
      addMessage(`✅ Déplacement effectué`, 'user');
      // Passer au tour suivant
      setTimeout(() => nextTurn(), 1500);
    }

    // Réinitialiser le résultat des dés
    setDiceResult(null);
  };

  return (
    <div className="container">
      <h1 className="logo">CLUEDO</h1>

      {gameState && (
        <div className="game-info-bar">
          <div className="player-info">
            <span>👤 {playerCharacter?.name}</span>
            <span className="turn-indicator">
              {isPlayerTurn ? '🟢 Votre tour' : '🔴 En attente'}
            </span>
          </div>
          <div className="cards-count">
            🃏 {playerCards.length} cartes
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Section gauche: Plateau de jeu */}
        <div className="game-section">
          <BoardCSS
            selectedCharacter={selectedCharacter}
            diceResult={diceResult}
            onMoveComplete={handleMoveComplete}
            allCharacters={gameState?.characters || {}}
          />
        </div>

        {/* Section droite: Contrôles */}
        <div className="controls-section">
          <CardGrid
            selectedCards={selectedCards}
            onCardToggle={handleCardToggle}
            playerCards={playerCards}
          />

          <ChatZone
            messages={messages}
            onValidate={handleValidate}
            onDiceClick={() => {
              if (isPlayerTurn && !diceResult) {
                setShowDicePopup(true);
              } else if (!isPlayerTurn) {
                addMessage('⚠️ Ce n\'est pas votre tour !', 'system');
              }
            }}
            canRollDice={isPlayerTurn && !diceResult}
            selectedCards={selectedCards}
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
