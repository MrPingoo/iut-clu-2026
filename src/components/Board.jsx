import { useState, useEffect, useRef } from 'react';
import { CLUEDO_GRID, CHARACTERS, ROOM_NUMBERS } from '../config/boardConfig';
import { MovementController } from '../utils/pathfinding';
import '../styles/board.css';

function Board({ selectedCharacter, diceResult, onMoveComplete, allCharacters }) {
  const canvasRef = useRef(null);
  const boardImageRef = useRef(null);
  const [boardLoaded, setboardLoaded] = useState(false);
  const [characters, setCharacters] = useState({});
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [movementController] = useState(() => {
    // Créer le plateau pour le pathfinding
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

  // Synchroniser avec allCharacters si fourni (depuis GameManager)
  useEffect(() => {
    if (allCharacters && Object.keys(allCharacters).length > 0) {
      setCharacters(allCharacters);
    } else {
      // Initialiser avec les positions par défaut
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

  // Charger l'image du plateau
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/images/board.jpg';
    img.onload = () => {
      boardImageRef.current = img;
      setboardLoaded(true);
      drawBoard();
    };
  }, []);

  // Redessiner quand les personnages bougent
  useEffect(() => {
    if (boardLoaded) {
      drawBoard();
    }
  }, [characters, possibleMoves, currentPath, boardLoaded]);

  // Calculer les mouvements possibles quand les dés sont lancés
  useEffect(() => {
    if (diceResult && selectedCharacter && characters[selectedCharacter]) {
      const character = characters[selectedCharacter];
      const moves = movementController.obtenirMouvementsPossibles(character, diceResult);
      setPossibleMoves(moves);
    } else {
      setPossibleMoves([]);
    }
  }, [diceResult, selectedCharacter, characters]);

  const drawBoard = () => {
    const canvas = canvasRef.current;
    const img = boardImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / 24;

    // Dessiner l'image du plateau
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Dessiner les mouvements possibles
    possibleMoves.forEach(move => {
      const { destination } = move;
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(
        destination.x * cellSize,
        destination.y * cellSize,
        cellSize,
        cellSize
      );
    });

    // Dessiner le chemin actuel
    if (currentPath.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      currentPath.forEach((point, index) => {
        const x = (point.x + 0.5) * cellSize;
        const y = (point.y + 0.5) * cellSize;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // Dessiner les personnages
    Object.values(characters).forEach(character => {
      const { position, color, name, id } = character;
      const x = (position.x + 0.5) * cellSize;
      const y = (position.y + 0.5) * cellSize;
      const radius = cellSize * 0.35;

      // Ombre portée
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Cercle du personnage
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Réinitialiser l'ombre
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Contour du personnage
      ctx.strokeStyle = selectedCharacter === id ? '#FFD700' : '#000';
      ctx.lineWidth = selectedCharacter === id ? 4 : 2;
      ctx.stroke();

      // Initiale du personnage
      ctx.fillStyle = name === 'Madame Leblanc' ? '#000' : '#fff';
      ctx.font = `bold ${cellSize * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name[0], x, y);
    });
  };

  const handleCanvasClick = (event) => {
    if (!diceResult || !selectedCharacter || !characters[selectedCharacter]) {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / 24;

    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    const destination = { x, y };

    // Vérifier si cette destination est dans les mouvements possibles
    const validMove = possibleMoves.find(
      move => move.destination.x === x && move.destination.y === y
    );

    if (validMove) {
      moveCharacter(destination, validMove.chemin);
    }
  };

  const handleCanvasMouseMove = (event) => {
    if (!diceResult || !selectedCharacter || !characters[selectedCharacter]) {
      setCurrentPath([]);
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / 24;

    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    // Trouver le chemin vers cette position
    const validMove = possibleMoves.find(
      move => move.destination.x === x && move.destination.y === y
    );

    if (validMove) {
      setCurrentPath(validMove.chemin);
    } else {
      setCurrentPath([]);
    }
  };

  const moveCharacter = async (destination, path) => {
    const character = characters[selectedCharacter];

    // Animer le déplacement
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
    setCurrentPath([]);

    // Notifier que le mouvement est terminé
    if (onMoveComplete) {
      const roomName = getRoomName(destination);
      onMoveComplete({
        character: character.name,
        position: destination,
        room: roomName
      });
    }
  };

  const getRoomName = (position) => {
    const cell = CLUEDO_GRID[position.y]?.[position.x];
    if (cell >= 3 && cell <= 11) {
      return ROOM_NUMBERS[cell];
    }
    return null;
  };

  return (
    <div className="board-wrapper">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="game-board-canvas"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setCurrentPath([])}
      />
      {diceResult && selectedCharacter && (
        <div className="board-info">
          <p>🎲 Mouvements disponibles : {diceResult}</p>
          <p>👤 Personnage : {characters[selectedCharacter]?.name}</p>
          {possibleMoves.length > 0 && (
            <p>✅ {possibleMoves.length} cases accessibles</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Board;
