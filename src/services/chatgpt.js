/**
 * Service ChatGPT pour gérer les joueurs IA dans Cluedo
 * Utilise l'API Symfony qui gère ChatGPT côté serveur
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ChatGPTService {
  constructor() {
    this.gameContext = null;
  }

  /**
   * Initialise le contexte du jeu pour l'IA
   */
  initializeGame(gameState) {
    this.gameContext = gameState;
  }

  /**
   * Demande à l'IA de jouer son tour via l'API Symfony
   */
  async playTurn(character, diceResult, possibleMoves, gameState) {
    try {
      const token = localStorage.getItem('token');
      const gameId = gameState.gameId;

      // Utiliser l'endpoint approprié selon si on a un gameId ou non
      const endpoint = gameId
        ? `${API_URL}/api/games/${gameId}/ai-turn`
        : `${API_URL}/api/games/ai-turn`;

      const headers = {
        'Content-Type': 'application/json'
      };

      // Ajouter le token seulement si on a un gameId (partie enregistrée)
      if (token && gameId) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          character,
          diceResult,
          possibleMoves,
          gameState
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const decision = await response.json();
      return decision;

    } catch (error) {
      console.error('Erreur API ChatGPT:', error);
      // Fallback sur IA de base
      return this.playBasicAI(character, diceResult, possibleMoves, gameState);
    }
  }


  /**
   * IA de base si l'API n'est pas disponible
   */
  playBasicAI(character, diceResult, possibleMoves, gameState) {
    const rooms = gameState.rooms || [];

    if (possibleMoves.length === 0) {
      return {
        action: 'wait',
        reasoning: 'Aucun mouvement possible'
      };
    }

    // Trier les mouvements par distance pour trouver les pièces accessibles
    const roomMoves = possibleMoves.filter(move => {
      const cell = gameState.grid?.[move.destination.y]?.[move.destination.x];
      return cell >= 3 && cell <= 11; // C'est une pièce
    });

    let selectedMove;
    if (roomMoves.length > 0) {
      // Choisir une pièce aléatoire parmi les accessibles
      selectedMove = roomMoves[Math.floor(Math.random() * roomMoves.length)];
    } else {
      // Choisir un mouvement aléatoire qui se rapproche du centre
      const centerX = 12;
      const centerY = 12;

      possibleMoves.sort((a, b) => {
        const distA = Math.abs(a.destination.x - centerX) + Math.abs(a.destination.y - centerY);
        const distB = Math.abs(b.destination.x - centerX) + Math.abs(b.destination.y - centerY);
        return distA - distB;
      });

      // Prendre l'un des 3 meilleurs mouvements
      const topMoves = possibleMoves.slice(0, Math.min(3, possibleMoves.length));
      selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    }

    return {
      action: 'move',
      target: selectedMove.destination,
      path: selectedMove.chemin,
      reasoning: roomMoves.length > 0
        ? `Je me dirige vers une pièce pour enquêter`
        : `Je me rapproche du centre du plateau`
    };
  }

  /**
   * Réinitialise la conversation
   */
  reset() {
    this.gameContext = null;
  }
}

export default new ChatGPTService();
