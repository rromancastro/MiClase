import { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

  const [userData, setUserData] = useState({
    rol: "estudiante",
    avatarRequired: {
        height: 160,
        width: 160,
        uri: "/assets/?unstable_path=.%2Fassets%2Favatars/6.png"
    },
    nombre: "Isabella",
    apellido: "Hernandez",
    email: "r@gmail.com",
    aulas: [],
    id: "5QKHSjjZv2Ve5WZ03iu4"
  });

  const logout = () => {
    setUserData({})
  }

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
