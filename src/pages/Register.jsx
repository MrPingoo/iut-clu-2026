import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas !');
      return;
    }

    try {
      await api.register(formData.email, formData.password);

      // Compte créé avec succès, redirection vers la page de login
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte');
      console.error('Erreur lors de l\'inscription:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">CLUEDO</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Créer un compte</h2>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="validate-button">
            Créer mon compte
          </button>

          <div className="auth-link">
            <p>
              Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
