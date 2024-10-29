import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { saveTokens } from '../utils/authUtils';
const Register = () => {
  const urlPath = 'http://localhost:4000/login';
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(urlPath, {
        email: email,
        password: password,
      });

      if (response.status === 201 || response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        console.log('Access Token primit:', accessToken);
        saveTokens(accessToken, refreshToken);
        navigate('/home');
      } else {
        throw new Error('Autentificare eșuată!');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Eroare de autentificare!');
    } finally {
      setLoading(false);
    }
  };

  const renderRegisterPage = () => {
    if (loading) {
      return <div className="text-center">LOADING.....</div>;
    }
    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }
    return (
      <>
        <form
          onSubmit={handleSignIn}
          className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
        >
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="py-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="flex justify-center rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </div>
        </form>
        <p>Salut din Register</p>
      </>
    );
  };

  return <>{renderRegisterPage()}</>;
};

export default Register;
