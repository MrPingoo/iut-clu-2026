import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CLUEDO_GRID, CHARACTERS, ROOM_NUMBERS } from '../config/boardConfig';
import { MovementController } from '../utils/pathfinding';
import '../styles/board-css.css';

function BoardCSS({ selectedCharacter, diceResult, onMoveComplete, allCharacters }) {
  const [characters, setCharacters] = useState({});
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [pathPreview, setPathPreview] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [showCoords, setShowCoords] = useState(false);

  const [movementController] = useState(() => {
    const plateau = {
      width: 24,
      height: 24,
      grid: CLUEDO_GRID.map(row =>
        row.map(cell => {
          if (cell === 0) return 'empty';
          if (cell === 1) return 'wall';
          if (cell === 2) return 'door';
          if (cell >= 3 && cell <= 11) return 'room';
          return 'wall';
        })
      )
    };
    return new MovementController(plateau);
  });

  // Synchroniser avec allCharacters
  useEffect(() => {
    if (allCharacters && Object.keys(allCharacters).length > 0) {
      setCharacters(allCharacters);
    } else {
      const initialPositions = {};
      Object.entries(CHARACTERS).forEach(([, char]) => {
        initialPositions[char.id] = {
          ...char,
          position: { ...char.startPosition }
        };
      });
      setCharacters(initialPositions);
    }
  }, [allCharacters]);

  // Calculer les mouvements possibles
  useEffect(() => {
    if (diceResult && selectedCharacter && characters[selectedCharacter]) {
      const character = characters[selectedCharacter];
      const moves = movementController.obtenirMouvementsPossibles(character, diceResult);
      setPossibleMoves(moves);
    } else {
      setPossibleMoves([]);
    }
  }, [diceResult, selectedCharacter, characters, movementController]);

  const getCellClass = (x, y) => {
    const cell = CLUEDO_GRID[y][x];

    if (cell === 0) return 'cell-empty';
    if (cell === 1) return 'cell-wall';
    if (cell === 2) return 'cell-door';
    if (cell >= 3 && cell <= 11) return `cell-room-${cell}`;
    return 'cell-wall';
  };

  const isPossibleMove = (x, y) => {
    return possibleMoves.some(move =>
      move.destination.x === x && move.destination.y === y
    );
  };

  const isInPathPreview = (x, y) => {
    return pathPreview.some(point => point.x === x && point.y === y);
  };

  const getCharacterAtPosition = (x, y) => {
    return Object.values(characters).find(
      char => char.position.x === x && char.position.y === y
    );
  };

  const getRoomLabel = (x, y) => {
    const cell = CLUEDO_GRID[y][x];
    if (cell >= 3 && cell <= 11) {
      const roomName = ROOM_NUMBERS[cell];

      // Définir les positions centrales pour chaque pièce
      const roomCenters = {
        3: { x: 3, y: 3 },   // Cuisine
        4: { x: 20, y: 2 },  // Salle de billard
        5: { x: 4, y: 12 },  // Bibliothèque
        6: { x: 20, y: 12 }, // Véranda
        7: { x: 12, y: 13 }, // Salle à manger (centre)
        8: { x: 4, y: 20 },  // Salon
        9: { x: 21, y: 21 }, // Hall
        10: { x: 3, y: 3 },  // Bureau (même que cuisine pour l'instant)
        11: { x: 2, y: 2 }   // Studio
      };

      const center = roomCenters[cell];
      if (center && x === center.x && y === center.y) {
        return <span className="room-label">{roomName}</span>;
      }
    }
    return null;
  };

  const handleCellClick = (x, y) => {
    if (!isPossibleMove(x, y) || !selectedCharacter) return;

    const validMove = possibleMoves.find(
      move => move.destination.x === x && move.destination.y === y
    );

    if (validMove) {
      moveCharacter({ x, y }, validMove.chemin);
    }
  };

  const handleCellHover = (x, y) => {
    setHoveredCell({ x, y });

    if (!isPossibleMove(x, y)) {
      setPathPreview([]);
      return;
    }

    const validMove = possibleMoves.find(
      move => move.destination.x === x && move.destination.y === y
    );

    if (validMove) {
      setPathPreview(validMove.chemin);
    } else {
      setPathPreview([]);
    }
  };

  const moveCharacter = async (destination, path) => {
    const character = characters[selectedCharacter];

    // Animer le déplacement case par case
    for (let i = 1; i < path.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setCharacters(prev => ({
        ...prev,
        [selectedCharacter]: {
          ...prev[selectedCharacter],
          position: { ...path[i] }
        }
      }));
    }

    // Réinitialiser
    setPossibleMoves([]);
    setPathPreview([]);

    // Notifier
    if (onMoveComplete) {
      const cell = CLUEDO_GRID[destination.y][destination.x];
      const roomName = ROOM_NUMBERS[cell] || null;

      onMoveComplete({
        character: character.name,
        position: destination,
        room: roomName
      });
    }
  };

  return (
    <div className="board-wrapper-css">
      {/* Options de debug */}
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <label style={{ color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          {' '}Afficher la grille
        </label>
        <label style={{ color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showCoords}
            onChange={(e) => setShowCoords(e.target.checked)}
          />
          {' '}Afficher les coordonnées
        </label>
      </div>

      {/* Plateau */}
      <div className={`board-css ${showGrid ? 'show-grid' : ''}`}>
        {CLUEDO_GRID.map((row, y) =>
          row.map((cell, x) => {
            const cellClass = getCellClass(x, y);
            const isPossible = isPossibleMove(x, y);
            const isPath = isInPathPreview(x, y);
            const characterHere = getCharacterAtPosition(x, y);
            const roomLabel = getRoomLabel(x, y);

            return (
              <div
                key={`${x}-${y}`}
                className={`
                  board-cell-css 
                  ${cellClass}
                  ${isPossible ? 'possible-move' : ''}
                  ${isPath ? 'path-preview' : ''}
                `}
                onClick={() => handleCellClick(x, y)}
                onMouseEnter={() => handleCellHover(x, y)}
                onMouseLeave={() => {
                  setHoveredCell(null);
                  setPathPreview([]);
                }}
                title={`(${x}, ${y})`}
              >
                {showCoords && (
                  <span className="cell-coords">{x},{y}</span>
                )}

                {roomLabel}

                {characterHere && (
                  <div
                    className={`character-pawn ${selectedCharacter === characterHere.id ? 'selected' : ''}`}
                    style={{ backgroundColor: characterHere.color }}
                    data-character={characterHere.id}
                  >
                    <span className="character-initial">
                      {characterHere.name[0]}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Informations */}
      {diceResult && selectedCharacter && (
        <div className="board-info-css">
          <p>
            🎲 Résultat des dés : <span className="info-highlight">{diceResult}</span>
          </p>
          <p>
            👤 Personnage : <span className="info-highlight">{characters[selectedCharacter]?.name}</span>
          </p>
          {possibleMoves.length > 0 && (
            <p>
              ✅ Cases accessibles : <span className="info-highlight">{possibleMoves.length}</span>
            </p>
          )}
          {hoveredCell && (
            <p>
              📍 Survol : <span className="info-highlight">({hoveredCell.x}, {hoveredCell.y})</span>
            </p>
          )}
        </div>
      )}

      {/* Légende */}
      <div className="board-legend-css">
        <div className="legend-item-css">
          <div className="legend-color-css" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4e4c1 100%)' }}></div>
          <span>Couloir</span>
        </div>
        <div className="legend-item-css">
          <div className="legend-color-css" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}></div>
          <span>Mur</span>
        </div>
        <div className="legend-item-css">
          <div className="legend-color-css" style={{ background: 'radial-gradient(circle, #f39c12 0%, #e67e22 100%)' }}></div>
          <span>Porte</span>
        </div>
        <div className="legend-item-css">
          <div className="legend-color-css" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' }}></div>
          <span>Case possible</span>
        </div>
      </div>
    </div>
  );
}

BoardCSS.propTypes = {
  selectedCharacter: PropTypes.string,
  diceResult: PropTypes.number,
  onMoveComplete: PropTypes.func,
  allCharacters: PropTypes.object
};

export default BoardCSS;
