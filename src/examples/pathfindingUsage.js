/**
 * Exemple d'utilisation du PathFinder dans le composant Game
 */

import { PathFinder, MovementController } from '../utils/pathfinding';

// Exemple d'utilisation dans un composant React

function ExempleUtilisationPathfinding() {
  // 1. Définir le plateau de Cluedo
  const plateau = {
    width: 25,
    height: 25,
    grid: [
      // Exemple simplifié : 'e' = empty, 'w' = wall, 'r' = room
      ['w', 'w', 'w', 'w', 'w', ...],
      ['w', 'e', 'e', 'e', 'w', ...],
      ['w', 'e', 'r', 'e', 'w', ...],
      // ... 25 lignes au total
    ]
  };

  // 2. Créer le contrôleur de mouvement
  const movementController = new MovementController(plateau);

  // 3. Définir un personnage
  const personnage = {
    id: 'colonel-moutarde',
    name: 'Colonel Moutarde',
    position: { x: 5, y: 10 }
  };

  // 4. Exemple 1 : Déplacement avec lancer de dés
  const handleDeplacementAvecDes = (destination) => {
    const resultat = movementController.deplacerPersonnage(personnage, destination);

    if (resultat.success) {
      console.log(`✅ Déplacement réussi !`);
      console.log(`Dés lancés : ${resultat.des.de1} + ${resultat.des.de2} = ${resultat.des.total}`);
      console.log(`Distance parcourue : ${resultat.distance}`);
      console.log(`Mouvements restants : ${resultat.mouvementsRestants}`);
      console.log(`Chemin :`, resultat.chemin);

      // Mettre à jour la position du personnage
      personnage.position = resultat.nouvellePosition;

      // Animation du déplacement (optionnel)
      animerDeplacement(resultat.chemin);
    } else {
      console.log(`❌ ${resultat.message}`);
      if (resultat.des) {
        console.log(`Dés lancés : ${resultat.des.de1} + ${resultat.des.de2} = ${resultat.des.total}`);
      }
    }
  };

  // 5. Exemple 2 : Déplacement avec nombre de mouvements fixe
  const handleDeplacementAvecMouvements = (destination, mouvements) => {
    const resultat = movementController.deplacerPersonnage(
      personnage,
      destination,
      mouvements
    );

    if (resultat.success) {
      console.log(`✅ Déplacement réussi avec ${mouvements} mouvements`);
      personnage.position = resultat.nouvellePosition;
    } else {
      console.log(`❌ ${resultat.message}`);
    }
  };

  // 6. Exemple 3 : Obtenir toutes les cases accessibles
  const handleAfficherCasesAccessibles = () => {
    const des = movementController.lancerDes();
    console.log(`Dés : ${des.total}`);

    const mouvementsPossibles = movementController.obtenirMouvementsPossibles(
      personnage,
      des.total
    );

    console.log(`Cases accessibles : ${mouvementsPossibles.length}`);

    // Mettre en surbrillance les cases accessibles sur le plateau
    mouvementsPossibles.forEach(mouvement => {
      highlightCell(mouvement.destination, 'accessible');
    });
  };

  // 7. Exemple 4 : Vérifier si une destination est atteignable
  const handleVerifierDestination = (destination) => {
    const pathfinder = new PathFinder(plateau);
    const chemin = pathfinder.findPath(personnage.position, destination);

    if (chemin) {
      const distance = chemin.length - 1;
      console.log(`✅ Destination atteignable en ${distance} mouvements`);
      console.log(`Chemin :`, chemin);
      return true;
    } else {
      console.log(`❌ Destination inatteignable`);
      return false;
    }
  };

  // 8. Fonction d'animation (exemple)
  const animerDeplacement = async (chemin) => {
    for (let i = 0; i < chemin.length; i++) {
      const point = chemin[i];
      console.log(`Étape ${i + 1}/${chemin.length} : (${point.x}, ${point.y})`);

      // Attendre 200ms entre chaque étape
      await new Promise(resolve => setTimeout(resolve, 200));

      // Mettre à jour l'affichage du personnage
      // updatePersonnageDisplay(point);
    }
  };

  // 9. Gestion du clic sur une case
  const handleCellClick = (x, y) => {
    const destination = { x, y };

    // Vérifier si la case est valide
    const pathfinder = new PathFinder(plateau);
    if (!pathfinder.estCaseValide(destination)) {
      console.log('❌ Cette case est bloquée');
      return;
    }

    // Tenter le déplacement
    handleDeplacementAvecDes(destination);
  };

  return (
    <div>
      {/* Votre interface de jeu */}
    </div>
  );
}

// Exemple d'intégration dans un hook personnalisé
function useGameMovement(plateau, personnage) {
  const [mouvementsDisponibles, setMouvementsDisponibles] = useState(0);
  const [casesAccessibles, setCasesAccessibles] = useState([]);
  const [cheminActuel, setCheminActuel] = useState(null);

  const movementController = useMemo(
    () => new MovementController(plateau),
    [plateau]
  );

  // Lancer les dés
  const lancerDes = useCallback(() => {
    const des = movementController.lancerDes();
    setMouvementsDisponibles(des.total);

    // Calculer les cases accessibles
    const possibles = movementController.obtenirMouvementsPossibles(
      personnage,
      des.total
    );
    setCasesAccessibles(possibles);

    return des;
  }, [movementController, personnage]);

  // Déplacer le personnage
  const deplacer = useCallback((destination) => {
    const resultat = movementController.deplacerPersonnage(
      personnage,
      destination,
      mouvementsDisponibles
    );

    if (resultat.success) {
      setMouvementsDisponibles(resultat.mouvementsRestants);
      setCheminActuel(resultat.chemin);

      // Recalculer les cases accessibles
      if (resultat.mouvementsRestants > 0) {
        const possibles = movementController.obtenirMouvementsPossibles(
          { ...personnage, position: resultat.nouvellePosition },
          resultat.mouvementsRestants
        );
        setCasesAccessibles(possibles);
      } else {
        setCasesAccessibles([]);
      }
    }

    return resultat;
  }, [movementController, personnage, mouvementsDisponibles]);

  // Vérifier si une case est accessible
  const estAccessible = useCallback((position) => {
    return casesAccessibles.some(
      c => c.destination.x === position.x && c.destination.y === position.y
    );
  }, [casesAccessibles]);

  return {
    mouvementsDisponibles,
    casesAccessibles,
    cheminActuel,
    lancerDes,
    deplacer,
    estAccessible
  };
}

// Export
export { ExempleUtilisationPathfinding, useGameMovement };
