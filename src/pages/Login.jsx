import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Identifiants incorrects');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/games');
    } catch (err) {
      setError(err.message);
      // Pour le développement, redirection directe
      console.log('Mode développement - redirection vers /games');
      navigate('/games');
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
