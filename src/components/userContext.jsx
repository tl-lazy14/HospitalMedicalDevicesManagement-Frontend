import React, { createContext, useEffect, useState } from 'react';
import api from './axiosInterceptor';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userID = localStorage.getItem('userID');
    if (accessToken && userID) {
      api.get(`/user/${userID}`, {
        headers: { token: `Bearer ${accessToken}` },
      })
      .then(response => {
        const user = response.data;
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      })
      .finally(() => {
        setLoading(false); // Kết thúc quá trình loading
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};