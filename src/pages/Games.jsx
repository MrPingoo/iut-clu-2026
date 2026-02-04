import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await api.getGames();
      setGames(data);
    } catch (err) {
      console.error('Erreur lors du chargement des parties:', err);
      // En cas d'erreur, on affiche un tableau vide
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleNewGame = async () => {
    try {
      // Pour l'instant, on sélectionne un personnage aléatoire
      const characters = [
        'Colonel Moutarde',
        'Mademoiselle Rose',
        'Révérend Olive',
        'Professeur Violet',
        'Madame Leblanc',
        'Docteur Lenoir'
      ];
      const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

      const newGame = await api.createGame(randomCharacter);
      navigate(`/game/${newGame.id}`);
    } catch (err) {
      console.error('Erreur lors de la création de la partie:', err);
      // En mode développement, on redirige quand même
      navigate('/game');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="logo">CLUEDO</h1>
          <p style={{ textAlign: 'center', color: '#ffd700' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="games-container">
      <div className="games-box">
        <h1 className="logo">CLUEDO</h1>

        <div className="games-content">
          <h2>Mes Parties</h2>

          <table className="games-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Personnage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    Aucune partie en cours
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id}>
                    <td>{formatDate(game.date)}</td>
                    <td>
                      <div className={`character-badge character-${game.characterColor}`}>
                        <span>{game.character}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="play-button"
                        onClick={() => handlePlayGame(game.id)}
                      >
                        Jouer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button className="new-game-button" onClick={handleNewGame}>
            Commencer une nouvelle partie
          </button>

          <div className="auth-link" style={{ marginTop: '20px' }}>
            <a href="#" onClick={handleLogout}>Se déconnecter</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Games;
