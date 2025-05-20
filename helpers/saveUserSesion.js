import AsyncStorage from '@react-native-async-storage/async-storage';

const saveUserSession = async (userData) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  } catch (e) {
    console.error('Error guardando sesión:', e);
  }
};

export default saveUserSession