/**
 * Guide d'utilisation du système de déplacement
 * Ce fichier montre comment intégrer le déplacement dans votre page
 */

import React, { useState } from 'react';
import Board from '../components/Board';
import { CHARACTERS, ROOMS } from '../config/boardConfig';

// =============================================================================
// EXEMPLE 1 : Utilisation basique
// =============================================================================

function ExempleBasique() {
  const [selectedCharacter, setSelectedCharacter] = useState('colonel-moutarde');
  const [diceResult, setDiceResult] = useState(null);

  const handleRollDice = () => {
    const roll = Math.floor(Math.random() * 11) + 2; // 2-12
    setDiceResult(roll);
    console.log(`🎲 Dés lancés : ${roll}`);
  };

  const handleMoveComplete = (moveInfo) => {
    console.log('✅ Mouvement terminé :', moveInfo);
    setDiceResult(null); // Réinitialiser après le mouvement
  };

  return (
    <div>
      <h1>Exemple Basique</h1>
      <button onClick={handleRollDice}>🎲 Lancer les dés</button>
      {diceResult && <p>Mouvements disponibles : {diceResult}</p>}

      <Board
        selectedCharacter={selectedCharacter}
        diceResult={diceResult}
        onMoveComplete={handleMoveComplete}
      />
    </div>
  );
}

// =============================================================================
// EXEMPLE 2 : Avec sélection de personnage
// =============================================================================

function ExempleAvecSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [diceResult, setDiceResult] = useState(null);
  const [history, setHistory] = useState([]);

  const selectCharacter = (characterId) => {
    setSelectedCharacter(characterId);
    setDiceResult(null); // Reset dés quand on change de personnage
  };

  const handleRollDice = () => {
    if (!selectedCharacter) {
      alert('Sélectionnez d\'abord un personnage !');
      return;
    }
    const roll = Math.floor(Math.random() * 11) + 2;
    setDiceResult(roll);
  };

  const handleMoveComplete = (moveInfo) => {
    // Ajouter à l'historique
    setHistory(prev => [...prev, {
      timestamp: new Date(),
      ...moveInfo
    }]);
    setDiceResult(null);
  };

  return (
    <div>
      <h1>Sélection de personnage</h1>

      {/* Sélecteur de personnage */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {Object.entries(CHARACTERS).map(([key, char]) => (
          <button
            key={char.id}
            onClick={() => selectCharacter(char.id)}
            style={{
              backgroundColor: selectedCharacter === char.id ? char.color : '#ccc',
              padding: '10px',
              border: selectedCharacter === char.id ? '3px solid gold' : '1px solid black'
            }}
          >
            {char.name}
          </button>
        ))}
      </div>

      {/* Bouton dés */}
      <button
        onClick={handleRollDice}
        disabled={!selectedCharacter}
      >
        🎲 Lancer les dés
      </button>

      {/* Plateau */}
      <Board
        selectedCharacter={selectedCharacter}
        diceResult={diceResult}
        onMoveComplete={handleMoveComplete}
      />

      {/* Historique */}
      <div style={{ marginTop: '20px' }}>
        <h3>📜 Historique des mouvements</h3>
        <ul>
          {history.map((move, idx) => (
            <li key={idx}>
              {move.character} → {move.room || `(${move.position.x}, ${move.position.y})`}
              {' '}à {move.timestamp.toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// =============================================================================
// EXEMPLE 3 : Intégration complète avec hypothèses
// =============================================================================

function ExempleComplet() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [diceResult, setDiceResult] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [hypothesis, setHypothesis] = useState({
    location: null,
    character: null,
    weapon: null
  });

  const handleRollDice = () => {
    if (!selectedCharacter) {
      alert('Sélectionnez d\'abord un personnage !');
      return;
    }
    const roll = Math.floor(Math.random() * 11) + 2;
    setDiceResult(roll);
  };

  const handleMoveComplete = (moveInfo) => {
    if (moveInfo.room) {
      setCurrentRoom(moveInfo.room);
      setHypothesis(prev => ({ ...prev, location: moveInfo.room }));
      alert(`Vous êtes entré dans ${moveInfo.room} ! Faites votre hypothèse.`);
    }
    setDiceResult(null);
  };

  const submitHypothesis = () => {
    if (!hypothesis.location || !hypothesis.character || !hypothesis.weapon) {
      alert('Complétez votre hypothèse !');
      return;
    }

    console.log('🔍 Hypothèse :', hypothesis);
    alert(`Hypothèse : ${hypothesis.character} dans ${hypothesis.location} avec ${hypothesis.weapon}`);

    // Réinitialiser
    setHypothesis({ location: null, character: null, weapon: null });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
      {/* Partie gauche : Plateau */}
      <div>
        <h1>Cluedo Complet</h1>

        <div style={{ marginBottom: '20px' }}>
          <label>Personnage : </label>
          <select
            value={selectedCharacter || ''}
            onChange={(e) => setSelectedCharacter(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            {Object.entries(CHARACTERS).map(([, char]) => (
              <option key={char.id} value={char.id}>{char.name}</option>
            ))}
          </select>

          <button onClick={handleRollDice} disabled={!selectedCharacter}>
            🎲 Lancer les dés {diceResult && `(${diceResult})`}
          </button>
        </div>

        <Board
          selectedCharacter={selectedCharacter}
          diceResult={diceResult}
          onMoveComplete={handleMoveComplete}
        />
      </div>

      {/* Partie droite : Hypothèse */}
      <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>🔍 Faire une hypothèse</h2>

        {currentRoom ? (
          <>
            <p><strong>Lieu actuel :</strong> {currentRoom}</p>

            <div style={{ marginBottom: '10px' }}>
              <label>Personnage : </label>
              <select
                value={hypothesis.character || ''}
                onChange={(e) => setHypothesis(prev => ({ ...prev, character: e.target.value }))}
              >
                <option value="">-- Choisir --</option>
                {Object.entries(CHARACTERS).map(([, char]) => (
                  <option key={char.id} value={char.name}>{char.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Arme : </label>
              <select
                value={hypothesis.weapon || ''}
                onChange={(e) => setHypothesis(prev => ({ ...prev, weapon: e.target.value }))}
              >
                <option value="">-- Choisir --</option>
                <option value="Poignard">Poignard</option>
                <option value="Chandelier">Chandelier</option>
                <option value="Revolver">Revolver</option>
                <option value="Corde">Corde</option>
                <option value="Clé anglaise">Clé anglaise</option>
                <option value="Matraque">Matraque</option>
              </select>
            </div>

            <button
              onClick={submitHypothesis}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            >
              Valider l'hypothèse
            </button>
          </>
        ) : (
          <p style={{ color: '#666' }}>
            Déplacez-vous dans une pièce pour faire une hypothèse
          </p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// EXEMPLE 4 : Mode démo automatique
// =============================================================================

function ExempleDemo() {
  const [selectedCharacter] = useState('colonel-moutarde');
  const [diceResult, setDiceResult] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  React.useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setDiceResult(Math.floor(Math.random() * 11) + 2);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlay]);

  const handleMoveComplete = (moveInfo) => {
    console.log('Auto-move:', moveInfo);
    setTimeout(() => setDiceResult(null), 1000);
  };

  return (
    <div>
      <h1>Mode Démo (Auto-play)</h1>

      <button onClick={() => setIsAutoPlay(!isAutoPlay)}>
        {isAutoPlay ? '⏸ Pause' : '▶️ Démarrer démo'}
      </button>

      <Board
        selectedCharacter={selectedCharacter}
        diceResult={diceResult}
        onMoveComplete={handleMoveComplete}
      />
    </div>
  );
}

// =============================================================================
// EXEMPLE 5 : Utilisation programmatique du pathfinding
// =============================================================================

function ExemplePathfinding() {
  const [result, setResult] = React.useState(null);

  const testPathfinding = () => {
    // Import dynamique
    import('../utils/pathfinding').then(({ PathFinder }) => {
      const plateau = {
        width: 24,
        height: 24,
        grid: [] // À remplir avec CLUEDO_GRID
      };

      const pathfinder = new PathFinder(plateau);
      const chemin = pathfinder.findPath(
        { x: 0, y: 17 }, // Colonel Moutarde départ
        { x: 10, y: 10 }  // Centre du plateau
      );

      setResult({
        found: !!chemin,
        distance: chemin ? chemin.length - 1 : 0,
        path: chemin
      });
    });
  };

  return (
    <div>
      <h1>Test Pathfinding</h1>
      <button onClick={testPathfinding}>Tester pathfinding</button>

      {result && (
        <div>
          <p>Chemin trouvé : {result.found ? '✅ Oui' : '❌ Non'}</p>
          <p>Distance : {result.distance} cases</p>
          <pre>{JSON.stringify(result.path, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ExempleBasique,
  ExempleAvecSelection,
  ExempleComplet,
  ExempleDemo,
  ExemplePathfinding
};

// Export par défaut : exemple complet
export default ExempleComplet;
