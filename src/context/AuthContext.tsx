import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginAdmin as loginAdminService } from '../services/database';

interface AuthContextType {
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loginAdmin: async () => false,
  logoutAdmin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_session') === 'true';
  });

  const loginAdmin = async (password: string): Promise<boolean> => {
    const success = await loginAdminService(password);
    if (success) {
      setIsAdmin(true);
      sessionStorage.setItem('admin_session', 'true');
    }
    return success;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_session');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
