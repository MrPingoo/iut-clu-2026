/**
 * Algorithme de pathfinding A* pour le plateau de Cluedo
 * Trouve le chemin le plus court entre deux points
 */

class PathFinder {
  constructor(plateau) {
    this.plateau = plateau;
    this.width = plateau.width || 25;
    this.height = plateau.height || 25;
    this.grid = plateau.grid || [];
  }

  /**
   * Trouve le chemin le plus court entre deux points
   * @param {Object} debut - Point de départ {x, y}
   * @param {Object} fin - Point d'arrivée {x, y}
   * @returns {Array|null} - Tableau de points formant le chemin, ou null si aucun chemin
   */
  findPath(debut, fin) {
    // Vérification des entrées
    if (!this.estCaseValide(debut) || !this.estCaseValide(fin)) {
      return null;
    }

    const listeOuverte = [debut];
    const listeFermee = new Set();
    const coutG = new Map();
    const parent = new Map();

    coutG.set(this.getKey(debut), 0);

    while (listeOuverte.length > 0) {
      // Trouver le nœud avec le plus petit f(n)
      const courant = this.getNoeudPlusPetitF(listeOuverte, coutG, fin);
      const courantKey = this.getKey(courant);

      // Destination atteinte
      if (courant.x === fin.x && courant.y === fin.y) {
        return this.reconstruireChemin(parent, debut, fin);
      }

      // Retirer de la liste ouverte et ajouter à la liste fermée
      const index = listeOuverte.findIndex(n => this.getKey(n) === courantKey);
      listeOuverte.splice(index, 1);
      listeFermee.add(courantKey);

      // Explorer les voisins
      const voisins = this.obtenirVoisins(courant);

      for (const voisin of voisins) {
        const voisinKey = this.getKey(voisin);

        if (listeFermee.has(voisinKey)) {
          continue;
        }

        const nouveauCoutG = coutG.get(courantKey) + 1;

        const dejaExplore = listeOuverte.some(n => this.getKey(n) === voisinKey);

        if (!dejaExplore) {
          listeOuverte.push(voisin);
        } else if (nouveauCoutG >= (coutG.get(voisinKey) || Infinity)) {
          continue;
        }

        // Ce chemin est meilleur, on l'enregistre
        parent.set(voisinKey, courant);
        coutG.set(voisinKey, nouveauCoutG);
      }
    }

    return null; // Aucun chemin trouvé
  }

  /**
   * Calcule la distance heuristique (Manhattan)
   */
  calculerH(point, fin) {
    return Math.abs(point.x - fin.x) + Math.abs(point.y - fin.y);
  }

  /**
   * Calcule f(n) = g(n) + h(n)
   */
  calculerF(point, coutG, fin) {
    const key = this.getKey(point);
    const g = coutG.get(key) || 0;
    const h = this.calculerH(point, fin);
    return g + h;
  }

  /**
   * Trouve le nœud avec le plus petit f(n) dans la liste
   */
  getNoeudPlusPetitF(liste, coutG, fin) {
    return liste.reduce((meilleur, noeud) => {
      const fNoeud = this.calculerF(noeud, coutG, fin);
      const fMeilleur = this.calculerF(meilleur, coutG, fin);
      return fNoeud < fMeilleur ? noeud : meilleur;
    });
  }

  /**
   * Obtient les cases voisines praticables
   */
  obtenirVoisins(point) {
    const voisins = [];
    const directions = [
      { x: 0, y: -1 },  // Haut
      { x: 0, y: 1 },   // Bas
      { x: -1, y: 0 },  // Gauche
      { x: 1, y: 0 }    // Droite
    ];

    for (const dir of directions) {
      const voisin = {
        x: point.x + dir.x,
        y: point.y + dir.y
      };

      if (this.estCaseValide(voisin)) {
        voisins.push(voisin);
      }
    }

    return voisins;
  }

  /**
   * Vérifie si une case est valide et praticable
   */
  estCaseValide(point) {
    const { x, y } = point;

    // Vérifier les limites du plateau
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return false;
    }

    // Si pas de grille définie, toutes les cases sont valides
    if (!this.grid || this.grid.length === 0) {
      return true;
    }

    // Vérifier si la case est praticable
    const cellule = this.grid[y]?.[x];

    // Cases invalides : murs, pièces bloquées, etc.
    if (cellule === 'wall' || cellule === 'blocked') {
      return false;
    }

    return true;
  }

  /**
   * Reconstruit le chemin depuis la destination jusqu'au départ
   */
  reconstruireChemin(parent, debut, fin) {
    const chemin = [fin];
    let courant = fin;
    const debutKey = this.getKey(debut);

    while (this.getKey(courant) !== debutKey) {
      const courantKey = this.getKey(courant);
      courant = parent.get(courantKey);

      if (!courant) {
        // Sécurité : si on ne peut pas remonter, retourner null
        return null;
      }

      chemin.unshift(courant);
    }

    return chemin;
  }

  /**
   * Génère une clé unique pour un point
   */
  getKey(point) {
    return `${point.x},${point.y}`;
  }

  /**
   * Calcule la distance d'un chemin
   */
  calculerDistanceChemin(chemin) {
    return chemin ? chemin.length - 1 : 0;
  }
}

/**
 * Contrôleur de mouvement pour le jeu Cluedo
 */
class MovementController {
  constructor(plateau) {
    this.pathfinder = new PathFinder(plateau);
  }

  /**
   * Lance deux dés à 6 faces
   */
  lancerDes() {
    const de1 = Math.floor(Math.random() * 6) + 1;
    const de2 = Math.floor(Math.random() * 6) + 1;
    return {
      de1,
      de2,
      total: de1 + de2
    };
  }

  /**
   * Vérifie si un déplacement est possible
   */
  peutSeDeplacer(chemin, mouvementsDisponibles) {
    if (!chemin) return false;
    const distance = chemin.length - 1;
    return distance <= mouvementsDisponibles;
  }

  /**
   * Déplace un personnage vers une destination
   */
  deplacerPersonnage(personnage, destination, mouvementsDisponibles = null) {
    // Si pas de mouvements spécifiés, lancer les dés
    let mouvements = mouvementsDisponibles;
    let des = null;

    if (mouvements === null) {
      des = this.lancerDes();
      mouvements = des.total;
    }

    // Trouver le chemin
    const chemin = this.pathfinder.findPath(personnage.position, destination);

    if (!chemin) {
      return {
        success: false,
        message: 'Aucun chemin trouvé vers cette destination',
        des
      };
    }

    const distance = chemin.length - 1;

    if (!this.peutSeDeplacer(chemin, mouvements)) {
      return {
        success: false,
        message: `Pas assez de mouvements (${mouvements} disponibles, ${distance} nécessaires)`,
        chemin,
        distance,
        des
      };
    }

    // Déplacement réussi
    return {
      success: true,
      chemin,
      distance,
      anciennePosition: { ...personnage.position },
      nouvellePosition: destination,
      mouvementsUtilises: distance,
      mouvementsRestants: mouvements - distance,
      des
    };
  }

  /**
   * Obtient tous les mouvements possibles pour un personnage
   */
  obtenirMouvementsPossibles(personnage, mouvementsDisponibles) {
    const possibles = [];
    const position = personnage.position;

    // Explorer toutes les cases dans un rayon de mouvementsDisponibles
    for (let dx = -mouvementsDisponibles; dx <= mouvementsDisponibles; dx++) {
      for (let dy = -mouvementsDisponibles; dy <= mouvementsDisponibles; dy++) {
        const destination = {
          x: position.x + dx,
          y: position.y + dy
        };

        // Vérifier si la case est valide
        if (!this.pathfinder.estCaseValide(destination)) {
          continue;
        }

        // Trouver le chemin
        const chemin = this.pathfinder.findPath(position, destination);

        if (chemin && this.peutSeDeplacer(chemin, mouvementsDisponibles)) {
          possibles.push({
            destination,
            chemin,
            distance: chemin.length - 1
          });
        }
      }
    }

    return possibles;
  }

  /**
   * Met à jour le plateau avec la nouvelle position
   */
  mettreAJourPlateau(plateau, personnage, anciennePosition, nouvellePosition) {
    // Retirer le personnage de l'ancienne position
    if (plateau.grid[anciennePosition.y]?.[anciennePosition.x] === personnage.id) {
      plateau.grid[anciennePosition.y][anciennePosition.x] = 'empty';
    }

    // Placer le personnage à la nouvelle position
    if (plateau.grid[nouvellePosition.y]?.[nouvellePosition.x] !== 'wall') {
      plateau.grid[nouvellePosition.y][nouvellePosition.x] = personnage.id;
    }

    return plateau;
  }
}

// Export pour utilisation dans d'autres fichiers
export { PathFinder, MovementController };
