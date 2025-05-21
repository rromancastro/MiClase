import { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    nombre: 'roman',
    rol: 'profesor'
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
