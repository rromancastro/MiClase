// utils/userSession.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserSesion = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error al leer los datos del usuario:', e);
    return null;
  }
};

export default getUserSesion