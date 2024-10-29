import axiosInstance from '../utils/axiosInstance';
import { useState } from 'react';

const HomePage = () => {
  const urlPath = 'http://localhost:3000/posts'; // Portul corect pentru serverul de date protejate este 3000
  const [jsonResponse, setJsonResponse] = useState(null); // Corectare a numelui variabilei pentru a respecta convențiile

  const handleRequest = async () => {
    try {
      const response = await axiosInstance.get(urlPath); // Metoda corectă este GET, deoarece obținem date
      if (response.data) {
        setJsonResponse(response.data);
      }
    } catch (error) {
      console.error('Eroare la obținerea datelor:', error);

      if (error.response) {
        console.error('Server responded with status:', error.response.status);
        console.error('Server response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }

      setJsonResponse('Eroare la obținerea datelor.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl mb-4">HOME</h1>
      <button
        onClick={handleRequest}
        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
      >
        REQUEST
      </button>
      {jsonResponse && (
        <pre className="mt-4 p-4 bg-gray-100 rounded-md w-full max-w-lg">
          {JSON.stringify(jsonResponse, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default HomePage;
