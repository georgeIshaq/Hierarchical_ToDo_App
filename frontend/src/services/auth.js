import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:5000/api';

const authService = {
    // Register a new user
    async register(username, email, password) {
        // Send a POST request to the register endpoint
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password,
    });
    // If the response contains an access token, store it in local storage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(username, password) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService;
