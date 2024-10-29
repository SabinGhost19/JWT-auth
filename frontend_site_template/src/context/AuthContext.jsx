import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }, [accessToken, refreshToken]);

  const saveTokens = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axiosInstance.post('http://localhost:4000/refresh', {
        token: refreshToken,
      });
      saveTokens(response.data.accessToken, refreshToken);
      return response.data.accessToken;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      clearTokens();
      navigate('/login');
      throw new Error('Session expired. Please log in again.');
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, saveTokens, refreshAccessToken, clearTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
