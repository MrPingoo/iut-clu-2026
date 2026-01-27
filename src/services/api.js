// Service API pour centraliser les appels à l'API Symfony

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  /**
   * Effectue une requête HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token si disponible
    const token = localStorage.getItem('token');
    if (token && !endpoint.includes('/login') && !endpoint.includes('/register')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Authentification
   */
  async login(username, password) {
    return this.request('/api/login_check', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(email, password) {
    return this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * Gestion des parties
   */
  async getGames() {
    return this.request('/api/games');
  }

  async createGame(character) {
    return this.request('/api/games', {
      method: 'POST',
      body: JSON.stringify({ character }),
    });
  }

  async getGame(id) {
    return this.request(`/api/games/${id}`);
  }

  async makeMove(gameId, location, character, weapon) {
    return this.request(`/api/games/${gameId}/move`, {
      method: 'PUT',
      body: JSON.stringify({ location, character, weapon }),
    });
  }
}

export default new ApiService();
