import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults to use the Proxy (relative path)
  axios.defaults.baseURL = '/api';
  axios.defaults.withCredentials = true; // Ensure cookies/headers are passed
  axios.defaults.timeout = 10000; // 10 seconds timeout

  // Check if token exists on load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      console.log('AuthContext: Checking user logged in...');
      const token = localStorage.getItem('token');
      if (token) {
        console.log('AuthContext: Token found, verifying...');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/auth/me');
          console.log('AuthContext: User verified:', res.data.name);
          setUser(res.data);
        } catch (error) {
          console.warn('AuthContext: Verification failed:', error.message);
          // Only log if it's not a 401 (unauthorized) error
          if (error.response?.status !== 401) {
            console.error(error);
          }
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        console.log('AuthContext: No token found.');
      }
      setLoading(false);
      console.log('AuthContext: Loading set to false.');
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password, role });
      const { token, ...userData } = res.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-slate-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
