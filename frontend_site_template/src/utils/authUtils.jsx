import axios from 'axios';

export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccesToken = () => {
  return localStorage.getItem('accessToken');
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const response = await axios.post('http://localhost:4000/refresh', {
      token: refreshToken,
    });

    saveTokens(response.data.accessToken, refreshToken);
    return response.data.accessToken;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error('Refresh token expired');
  }
};
