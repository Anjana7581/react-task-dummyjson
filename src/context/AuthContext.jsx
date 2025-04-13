import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store both token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (!token || !userData) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with API
        const response = await fetch('https://dummyjson.com/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const freshData = await response.json();
          // Update stored data with fresh user info
          localStorage.setItem('userData', JSON.stringify(freshData));
          setUser(freshData);
        } else {
          throw new Error('Session expired');
        }
      } catch (error) {
        // If API verification fails, try to use stored data as fallback
        try {
          const parsedData = JSON.parse(userData);
          if (parsedData && parsedData.id) {
            setUser(parsedData);
          } else {
            logout();
          }
        } catch (parseError) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};