const API_BASE_URL = "http://localhost:5000/api";

export const authService = {
  // Login function
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Store token
  setToken: (token) => {
    localStorage.setItem("token", token);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Store user data
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
