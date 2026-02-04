import { CLUEDO_GRID, ROOM_NUMBERS, CHARACTERS } from '../config/boardConfig';
import '../styles/board-debug.css';

function BoardDebug() {
  const getCellClass = (value) => {
    if (value === 0) return 'cell-empty';
    if (value === 1) return 'cell-wall';
    if (value === 2) return 'cell-door';
    if (value >= 3 && value <= 11) return `cell-room-${value}`;
    return 'cell-wall';
  };

  const getRoomName = (value) => {
    return ROOM_NUMBERS[value] || '';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>
        Vue Debug du Plateau Cluedo (24x24)
      </h2>

      {/* Légende */}
      <div className="board-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ecf0f1' }}></div>
          <span className="legend-label">0 = Couloir (empty)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#2c3e50' }}></div>
          <span className="legend-label">1 = Mur (wall)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#f39c12' }}></div>
          <span className="legend-label">2 = Porte (door)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#e74c3c' }}></div>
          <span className="legend-label">3 = Cuisine</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#3498db' }}></div>
          <span className="legend-label">4 = Salle de billard</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#2ecc71' }}></div>
          <span className="legend-label">5 = Bibliothèque</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#9b59b6' }}></div>
          <span className="legend-label">6 = Véranda</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#f1c40f' }}></div>
          <span className="legend-label">7 = Salle à manger</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#e67e22' }}></div>
          <span className="legend-label">8 = Salon</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#1abc9c' }}></div>
          <span className="legend-label">9 = Hall</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#34495e' }}></div>
          <span className="legend-label">10 = Bureau</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#95a5a6' }}></div>
          <span className="legend-label">11 = Studio</span>
        </div>
      </div>

      {/* Positions de départ des personnages */}
      <div style={{ margin: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
        <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Positions de départ:</h3>
        {Object.values(CHARACTERS).map(char => (
          <div key={char.id} style={{ color: '#fff', marginBottom: '5px' }}>
            • <strong>{char.name}</strong>: ({char.startPosition.x}, {char.startPosition.y}) - {char.color}
          </div>
        ))}
      </div>

      {/* Grille du plateau */}
      <div className="board-debug">
        {CLUEDO_GRID.map((row, y) =>
          row.map((cell, x) => {
            const cellClass = getCellClass(cell);
            const roomName = getRoomName(cell);

            return (
              <div
                key={`${x}-${y}`}
                className={`board-cell ${cellClass}`}
                title={`(${x}, ${y}) - ${roomName || (cell === 0 ? 'Couloir' : cell === 1 ? 'Mur' : cell === 2 ? 'Porte' : cell)}`}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>

      {/* Info supplémentaires */}
      <div style={{ margin: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
        <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Instructions:</h3>
        <p>• Les cases accessibles sont en <strong style={{ color: '#ecf0f1' }}>gris clair (0)</strong></p>
        <p>• Les portes <strong style={{ color: '#f39c12' }}>oranges (2)</strong> permettent d'entrer dans les pièces</p>
        <p>• Les pièces sont colorées selon leur numéro (3-11)</p>
        <p>• Survolez une case pour voir ses coordonnées (x, y)</p>
        <p>• Le plateau fait <strong>24 colonnes × 24 lignes</strong></p>
        <p>• Les coordonnées vont de <strong>(0,0) à (23,23)</strong></p>
      </div>
    </div>
  );
}

export default BoardDebug;
