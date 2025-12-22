import axios from "./auth.interceptor";

export const authService = {
  // Login function
  login: async (username, password) => {
    try {
      const response = await axios.post("/auth/login", { username, password });
      return response.data;
    } catch (error) {
      if (error?.response?.data) {
        throw new Error(error.response.data.message || "Login failed");
      }
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

//Must implement registration authetnication
export const RegistrationAuth = {
  validateRegistrationToken: (token) => {
    return true;
  },
};
