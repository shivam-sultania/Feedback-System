import React, { createContext, useState, useEffect } from 'react';
import { getToken, getRole } from '../auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());

  useEffect(() => {
  const t = getToken();
  const r = getRole();
  setToken(t);
  setRole(r);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
