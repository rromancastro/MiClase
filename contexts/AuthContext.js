// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, signUp } from '../api/authApi';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null, loading: true });

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('@auth');
      if (stored) setAuth(JSON.parse(stored));
      else setAuth({ token: null, user: null });
      setAuth(prev => ({ ...prev, loading: false }));
    })();
  }, []);

  const handleSignIn = async (email, password) => {
    const data = await signIn(email, password);
    const state = { token: data.idToken, user: { email, uid: data.localId } };
    setAuth(state);
    await AsyncStorage.setItem('@auth', JSON.stringify(state));
  };

  const handleSignUp = async (email, password) => {
    const data = await signUp(email, password);
    const state = { token: data.idToken, user: { email, uid: data.localId } };
    setAuth(state);
    await AsyncStorage.setItem('@auth', JSON.stringify(state));
  };

  const handleSignOut = async () => {
    setAuth({ token: null, user: null });
    await AsyncStorage.removeItem('@auth');
  };

  return (
    <AuthContext.Provider value={{ auth, handleSignIn, handleSignUp, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}
