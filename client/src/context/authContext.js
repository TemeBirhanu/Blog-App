import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      'http://localhost:8800/api/auth/login',
      inputs
    );
    setCurrentUser(res.data);
    localStorage.setItem('token', res.data.token); // Store token
  };

  const logout = async (inputs) => {
    await axios.post('http://localhost:8800/api/auth/logout');
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
