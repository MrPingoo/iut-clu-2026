/**
 * Configuration du plateau de Cluedo
 * Basé sur le plateau classique du jeu
 */

export const CELL_TYPES = {
  EMPTY: 'empty',        // Couloir praticable
  WALL: 'wall',          // Mur impraticable
  ROOM: 'room',          // Pièce (cases spéciales)
  DOOR: 'door',          // Porte d'entrée de pièce
  START: 'start',        // Position de départ d'un personnage
  SECRET: 'secret'       // Passage secret
};

export const ROOMS = {
  CUISINE: 'Cuisine',
  SALLE_BILLARD: 'Salle de billard',
  BIBLIOTHEQUE: 'Bibliothèque',
  VERANDA: 'Véranda',
  SALLE_MANGER: 'Salle à manger',
  SALON: 'Salon',
  HALL: 'Hall',
  BUREAU: 'Bureau',
  STUDIO: 'Studio'
};

export const CHARACTERS = {
  MOUTARDE: {
    id: 'colonel-moutarde',
    name: 'Colonel Moutarde',
    color: '#FFD700', // Jaune doré
    startPosition: { x: 0, y: 17 }
  },
  ROSE: {
    id: 'mademoiselle-rose',
    name: 'Mademoiselle Rose',
    color: '#FF1493', // Rose vif
    startPosition: { x: 23, y: 8 }
  },
  OLIVE: {
    id: 'reverend-olive',
    name: 'Révérend Olive',
    color: '#32CD32', // Vert lime
    startPosition: { x: 0, y: 8 }
  },
  VIOLET: {
    id: 'professeur-violet',
    name: 'Professeur Violet',
    color: '#9370DB', // Violet moyen
    startPosition: { x: 23, y: 16 }
  },
  LEBLANC: {
    id: 'madame-leblanc',
    name: 'Madame Leblanc',
    color: '#F5F5F5', // Blanc cassé
    startPosition: { x: 14, y: 0 }
  },
  LENOIR: {
    id: 'docteur-lenoir',
    name: 'Docteur Lenoir',
    color: '#1E90FF', // Bleu dodger
    startPosition: { x: 9, y: 23 }
  }
};

export const WEAPONS = {
  POIGNARD: 'Poignard',
  CHANDELIER: 'Chandelier',
  REVOLVER: 'Revolver',
  CORDE: 'Corde',
  CLE_ANGLAISE: 'Clé anglaise',
  MATRAQUE: 'Matraque'
};

/**
 * Grille du plateau de Cluedo (24x24)
 * Légende :
 * 0 = EMPTY (couloir)
 * 1 = WALL (mur)
 * 2 = DOOR (porte)
 * 3-11 = ROOM (pièces numérotées)
 * S = START (départ personnage)
 */
export const CLUEDO_GRID = [
  // Ligne 0
  [1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
  // Ligne 1
  [1,3,3,3,3,3,1,1,1,0,1,1,1,1,0,1,1,1,4,4,4,4,4,1],
  // Ligne 2
  [1,3,3,3,3,3,1,1,1,0,1,1,1,1,0,1,1,1,4,4,4,4,4,1],
  // Ligne 3
  [1,3,3,3,3,3,1,1,1,0,1,1,1,1,0,1,1,1,4,4,4,4,4,1],
  // Ligne 4
  [1,3,3,3,3,3,1,1,1,0,1,1,1,1,0,1,1,1,4,4,4,4,4,1],
  // Ligne 5
  [1,3,3,3,3,3,1,1,1,0,1,1,1,1,0,1,1,1,1,4,4,1,1,1],
  // Ligne 6
  [1,1,1,1,2,1,1,1,1,0,1,1,1,1,0,1,1,1,1,2,1,1,1,1],
  // Ligne 7
  [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  // Ligne 8
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  // Ligne 9
  [1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1],
  // Ligne 10
  [1,5,5,5,5,5,5,5,1,0,1,1,1,1,1,0,1,6,6,6,6,6,6,1],
  // Ligne 11
  [1,5,5,5,5,5,5,5,2,0,1,1,1,1,1,0,2,6,6,6,6,6,6,1],
  // Ligne 12
  [1,5,5,5,5,5,5,5,1,0,1,1,7,7,1,0,1,6,6,6,6,6,6,1],
  // Ligne 13
  [1,5,5,5,5,5,5,5,1,0,1,7,7,7,1,0,1,6,6,6,6,6,6,1],
  // Ligne 14
  [1,5,5,5,5,5,5,5,1,0,2,7,7,7,2,0,1,6,6,6,6,6,6,1],
  // Ligne 15
  [1,1,1,5,5,1,1,1,1,0,1,7,7,7,1,0,1,1,1,2,1,1,1,1],
  // Ligne 16
  [1,1,1,1,2,1,1,1,1,0,1,1,7,1,1,0,1,1,1,0,0,0,0,0],
  // Ligne 17
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  // Ligne 18
  [1,1,1,1,2,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1],
  // Ligne 19
  [1,8,8,8,8,8,1,1,1,0,1,1,1,1,1,0,1,1,1,1,9,9,9,1],
  // Ligne 20
  [1,8,8,8,8,8,1,1,1,0,1,1,1,1,1,0,1,1,1,1,9,9,9,1],
  // Ligne 21
  [1,8,8,8,8,8,1,1,1,0,1,1,1,1,1,0,1,1,1,1,9,9,9,1],
  // Ligne 22
  [1,8,8,8,8,8,1,1,1,0,1,1,1,1,1,0,0,0,0,2,9,9,9,1],
  // Ligne 23
  [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1]
];

/**
 * Correspondance des numéros de pièces
 */
export const ROOM_NUMBERS = {
  3: ROOMS.CUISINE,
  4: ROOMS.SALLE_BILLARD,
  5: ROOMS.BIBLIOTHEQUE,
  6: ROOMS.VERANDA,
  7: ROOMS.SALLE_MANGER,
  8: ROOMS.SALON,
  9: ROOMS.HALL,
  10: ROOMS.BUREAU,
  11: ROOMS.STUDIO
};

/**
 * Passages secrets entre pièces
 */
export const SECRET_PASSAGES = {
  [ROOMS.CUISINE]: { to: ROOMS.BUREAU, position: { x: 1, y: 1 } },
  [ROOMS.BUREAU]: { to: ROOMS.CUISINE, position: { x: 1, y: 22 } },
  [ROOMS.SALLE_BILLARD]: { to: ROOMS.VERANDA, position: { x: 22, y: 1 } },
  [ROOMS.VERANDA]: { to: ROOMS.SALLE_BILLARD, position: { x: 22, y: 22 } }
};

/**
 * Dimensions du plateau
 */
export const BOARD_CONFIG = {
  width: 24,
  height: 24,
  cellSize: 40 // Taille en pixels pour l'affichage
};

/**
 * Convertir la grille numérique en grille de types
 */
export function createBoardGrid() {
  return CLUEDO_GRID.map((row, y) =>
    row.map((cell, x) => {
      if (cell === 0) return CELL_TYPES.EMPTY;
      if (cell === 1) return CELL_TYPES.WALL;
      if (cell === 2) return CELL_TYPES.DOOR;
      if (cell >= 3 && cell <= 11) return CELL_TYPES.ROOM;
      return CELL_TYPES.WALL;
    })
  );
}

/**
 * Obtenir le nom de la pièce à une position donnée
 */
export function getRoomAt(x, y) {
  if (y < 0 || y >= CLUEDO_GRID.length || x < 0 || x >= CLUEDO_GRID[0].length) {
    return null;
  }

  const cell = CLUEDO_GRID[y][x];
  return ROOM_NUMBERS[cell] || null;
}

/**
 * Vérifier si une position est une porte
 */
export function isDoor(x, y) {
  if (y < 0 || y >= CLUEDO_GRID.length || x < 0 || x >= CLUEDO_GRID[0].length) {
    return false;
  }
  return CLUEDO_GRID[y][x] === 2;
}

/**
 * Vérifier si une position est dans une pièce
 */
export function isInRoom(x, y) {
  if (y < 0 || y >= CLUEDO_GRID.length || x < 0 || x >= CLUEDO_GRID[0].length) {
    return false;
  }
  const cell = CLUEDO_GRID[y][x];
  return cell >= 3 && cell <= 11;
}

/**
 * Obtenir les portes d'une pièce
 */
export function getRoomDoors(roomName) {
  const doors = [];

  CLUEDO_GRID.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 2) {
        // Vérifier les cases adjacentes pour trouver la pièce
        const neighbors = [
          { x: x - 1, y },
          { x: x + 1, y },
          { x, y: y - 1 },
          { x, y: y + 1 }
        ];

        for (const neighbor of neighbors) {
          if (getRoomAt(neighbor.x, neighbor.y) === roomName) {
            doors.push({ x, y });
            break;
          }
        }
      }
    });
  });

  return doors;
}

export default {
  CELL_TYPES,
  ROOMS,
  CHARACTERS,
  WEAPONS,
  CLUEDO_GRID,
  ROOM_NUMBERS,
  SECRET_PASSAGES,
  BOARD_CONFIG,
  createBoardGrid,
  getRoomAt,
  isDoor,
  isInRoom,
  getRoomDoors
};
