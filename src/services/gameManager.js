/**
 * Gestionnaire de jeu Cluedo
 * Gère la logique complète du jeu, les tours, les cartes, etc.
 */

import { CHARACTERS, ROOMS, WEAPONS, CLUEDO_GRID, ROOM_NUMBERS } from '../config/boardConfig';
import chatGPTService from './chatgpt';

class GameManager {
  constructor() {
    this.gameState = null;
    this.currentTurnIndex = 0;
  }

  /**
   * Initialise une nouvelle partie
   */
  initializeGame() {
    // Déterminer le coupable, l'arme et le lieu (solution secrète)
    const solution = {
      character: this.getRandomElement(Object.values(ROOMS)),
      weapon: this.getRandomElement(Object.values(WEAPONS)),
      location: this.getRandomElement(Object.values(ROOMS))
    };

    // Choisir aléatoirement le personnage du joueur
    const characterKeys = Object.keys(CHARACTERS);
    const playerCharacterKey = this.getRandomElement(characterKeys);
    const playerCharacter = CHARACTERS[playerCharacterKey];

    // Tous les personnages jouent (le joueur + 5 IA)
    const playingCharacters = Object.values(CHARACTERS).map((char) => ({
      ...char,
      position: { ...char.startPosition },
      isPlayer: char.id === playerCharacter.id,
      isAI: char.id !== playerCharacter.id,
      cards: [], // Sera rempli lors de la distribution
      eliminated: [] // Cartes éliminées par déduction
    }));

    // Distribution des cartes
    const allCards = [
      ...Object.values(ROOMS).filter(r => r !== solution.location),
      ...Object.values(WEAPONS).filter(w => w !== solution.weapon),
      ...Object.values(CHARACTERS).map(c => c.name).filter(n => n !== solution.character)
    ];

    // Mélanger les cartes
    const shuffledCards = this.shuffleArray([...allCards]);

    // Distribuer équitablement
    const cardsPerPlayer = Math.floor(shuffledCards.length / 6);
    playingCharacters.forEach((char, index) => {
      const startIndex = index * cardsPerPlayer;
      const endIndex = index === 5 ? shuffledCards.length : startIndex + cardsPerPlayer;
      char.cards = shuffledCards.slice(startIndex, endIndex);
    });

    this.gameState = {
      solution,
      characters: playingCharacters.reduce((acc, char) => {
        acc[char.id] = char;
        return acc;
      }, {}),
      playerCharacter: playerCharacter.id,
      turnOrder: playingCharacters.map(c => c.id),
      currentTurn: playerCharacter.id,
      currentTurnIndex: playingCharacters.findIndex(c => c.id === playerCharacter.id),
      grid: CLUEDO_GRID,
      history: [],
      previousHypotheses: [],
      gameOver: false,
      winner: null
    };

    // Initialiser ChatGPT avec le contexte du jeu
    chatGPTService.initializeGame(this.gameState);

    return {
      playerCharacter,
      gameState: this.gameState
    };
  }

  /**
   * Obtient l'état actuel du jeu
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * Obtient le personnage du joueur
   */
  getPlayerCharacter() {
    return this.gameState.characters[this.gameState.playerCharacter];
  }

  /**
   * Passe au tour suivant
   */
  nextTurn() {
    if (this.gameState.gameOver) {
      return null;
    }

    this.gameState.currentTurnIndex = (this.gameState.currentTurnIndex + 1) % this.gameState.turnOrder.length;
    this.gameState.currentTurn = this.gameState.turnOrder[this.gameState.currentTurnIndex];

    return this.gameState.characters[this.gameState.currentTurn];
  }

  /**
   * Vérifie si c'est le tour du joueur
   */
  isPlayerTurn() {
    return this.gameState.currentTurn === this.gameState.playerCharacter;
  }

  /**
   * Déplace un personnage
   */
  moveCharacter(characterId, newPosition) {
    if (!this.gameState.characters[characterId]) {
      return false;
    }

    const oldPosition = { ...this.gameState.characters[characterId].position };
    this.gameState.characters[characterId].position = newPosition;

    // Vérifier s'il est dans une pièce
    const cell = this.gameState.grid[newPosition.y]?.[newPosition.x];
    const room = ROOM_NUMBERS[cell] || null;

    // Enregistrer dans l'historique
    this.gameState.history.push({
      turn: this.gameState.currentTurnIndex,
      character: characterId,
      action: 'move',
      from: oldPosition,
      to: newPosition,
      room: room,
      timestamp: Date.now()
    });

    return {
      success: true,
      room: room
    };
  }

  /**
   * Fait une hypothèse
   */
  makeHypothesis(characterId, hypothesis) {
    const character = this.gameState.characters[characterId];

    if (!character) {
      return { success: false, message: 'Personnage invalide' };
    }

    // Enregistrer l'hypothèse
    const hypothesisRecord = {
      character: character.name,
      hypothesis: hypothesis,
      refutedBy: null,
      cardShown: null,
      timestamp: Date.now()
    };

    // Demander aux autres joueurs de réfuter (dans l'ordre)
    const otherPlayers = this.gameState.turnOrder
      .slice(this.gameState.currentTurnIndex + 1)
      .concat(this.gameState.turnOrder.slice(0, this.gameState.currentTurnIndex))
      .filter(id => id !== characterId);

    for (const playerId of otherPlayers) {
      const player = this.gameState.characters[playerId];

      // Vérifier si le joueur peut réfuter
      const refutingCard = player.cards.find(card =>
        card === hypothesis.location ||
        card === hypothesis.character ||
        card === hypothesis.weapon
      );

      if (refutingCard) {
        hypothesisRecord.refutedBy = player.name;
        hypothesisRecord.cardShown = refutingCard;

        // Si c'est le joueur humain qui fait l'hypothèse, il apprend la carte
        if (characterId === this.gameState.playerCharacter) {
          character.eliminated.push(refutingCard);
        }

        break;
      }
    }

    this.gameState.previousHypotheses.push(hypothesisRecord);

    // Enregistrer dans l'historique
    this.gameState.history.push({
      turn: this.gameState.currentTurnIndex,
      character: characterId,
      action: 'hypothesis',
      hypothesis: hypothesis,
      refuted: hypothesisRecord.refutedBy !== null,
      refutedBy: hypothesisRecord.refutedBy,
      timestamp: Date.now()
    });

    return {
      success: true,
      refuted: hypothesisRecord.refutedBy !== null,
      refutedBy: hypothesisRecord.refutedBy,
      cardShown: hypothesisRecord.cardShown
    };
  }

  /**
   * Fait une accusation finale
   */
  makeAccusation(characterId, accusation) {
    const character = this.gameState.characters[characterId];

    if (!character) {
      return { success: false, message: 'Personnage invalide' };
    }

    const isCorrect =
      accusation.location === this.gameState.solution.location &&
      accusation.character === this.gameState.solution.character &&
      accusation.weapon === this.gameState.solution.weapon;

    this.gameState.history.push({
      turn: this.gameState.currentTurnIndex,
      character: characterId,
      action: 'accusation',
      accusation: accusation,
      correct: isCorrect,
      timestamp: Date.now()
    });

    if (isCorrect) {
      this.gameState.gameOver = true;
      this.gameState.winner = characterId;

      return {
        success: true,
        correct: true,
        message: `${character.name} a résolu l'énigme ! C'était bien ${accusation.character} dans ${accusation.location} avec ${accusation.weapon} !`
      };
    } else {
      // Le joueur est éliminé
      character.eliminated = true;

      return {
        success: true,
        correct: false,
        message: `${character.name} s'est trompé et est éliminé de la partie !`,
        solution: this.gameState.solution
      };
    }
  }

  /**
   * Joue le tour d'une IA
   */
  async playAITurn(characterId, diceResult, possibleMoves) {
    const character = this.gameState.characters[characterId];

    if (!character || !character.isAI) {
      return null;
    }

    // Demander à ChatGPT de jouer
    const decision = await chatGPTService.playTurn(
      character,
      diceResult,
      possibleMoves,
      this.gameState
    );

    return decision;
  }

  /**
   * Utilitaires
   */
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Obtient les cartes du joueur
   */
  getPlayerCards() {
    const playerChar = this.getPlayerCharacter();
    return playerChar ? playerChar.cards : [];
  }

  /**
   * Obtient les cartes éliminées par déduction
   */
  getEliminatedCards() {
    const playerChar = this.getPlayerCharacter();
    return playerChar ? playerChar.eliminated : [];
  }

  /**
   * Sauvegarde l'état du jeu
   */
  saveGame() {
    return JSON.stringify(this.gameState);
  }

  /**
   * Charge un état de jeu sauvegardé
   */
  loadGame(savedState) {
    try {
      this.gameState = JSON.parse(savedState);
      chatGPTService.initializeGame(this.gameState);
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return false;
    }
  }
}

export default new GameManager();
