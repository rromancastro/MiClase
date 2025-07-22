import { useFonts } from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto.ttf'),
  });

  if (!fontsLoaded) return null;

  
  return (
    <UserProvider>
      <AuthProvider>
        <SafeAreaProvider>
            <AppNavigator />
            <Toast />
            <StatusBar style="dark" />
        </SafeAreaProvider>
      </AuthProvider>
    </UserProvider>
  )
}
