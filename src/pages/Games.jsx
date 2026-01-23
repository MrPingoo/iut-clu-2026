import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/games', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des parties');
      }

      const data = await response.json();
      setGames(data);
    } catch (err) {
      console.log('Mode développement - données de test');
      // Données de test pour le développement
      setGames([
        {
          id: 1,
          date: '2026-01-14T14:30:00',
          character: 'Colonel Moutarde',
          status: 'en_cours',
          characterColor: 'blue'
        },
        {
          id: 2,
          date: '2026-01-13T20:15:00',
          character: 'Mademoiselle Rose',
          status: 'terminee',
          characterColor: 'red'
        },
        {
          id: 3,
          date: '2026-01-12T18:45:00',
          character: 'Révérend Olive',
          status: 'en_cours',
          characterColor: 'green'
        },
        {
          id: 4,
          date: '2026-01-11T16:00:00',
          character: 'Professeur Violet',
          status: 'terminee',
          characterColor: 'purple'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleNewGame = () => {
    navigate('/game');
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
