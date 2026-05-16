import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const errorMap = {
    'invalid_credentials': 'The email or password you entered is incorrect.',
    'email_taken': 'This email is already registered. Please log in instead.',
    'validation_failed': 'Please check your input and try again.',
    'unexpected_error': 'Something went wrong on our end. Please try again later.'
  };

  const getFriendlyErrorMessage = (err) => {
    const errorKey = err.response?.data?.error;
    return errorMap[errorKey] || errorKey || 'An unexpected error occurred.';
  };

  // Configure axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_PATH_PREFIX || '/api/v1';
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await axios.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Session expired');
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { accessToken, user: userData } = res.data;
      localStorage.setItem('token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(userData);
      toast.success(`Welcome back, ${userData.fullName}!`);
      return userData;
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/auth/register', userData);
      toast.success('Account created! You can now log in.');
      return true;
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/auth/profile', profileData);
      setUser(res.data);
      toast.success('Profile updated successfully!');
      return res.data;
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
