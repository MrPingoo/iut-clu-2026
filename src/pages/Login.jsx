import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // L'API retourne { token: "..." }
      const response = await api.login(formData.email, formData.password);

      console.log('Login response:', response);

      // Utiliser le contexte pour stocker le token et l'utilisateur
      if (response.token) {
        // Extraire les données utilisateur du token ou utiliser celles retournées
        const userData = response.user || { email: formData.email };

        // Appeler la fonction login du contexte
        login(userData, response.token);

        console.log('Token saved via context, redirecting to /games');

        // Redirection vers la page des parties
        navigate('/games', { replace: true });
      } else {
        setError('Token manquant dans la réponse');
      }
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">CLUEDO</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Connexion</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="validate-button">
            Se connecter
          </button>

          <div className="auth-link">
            <p>
              Pas encore de compte ? <Link to="/register">Créer un compte</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
