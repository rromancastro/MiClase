import { useFonts } from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto.ttf'),
  });

  if (!fontsLoaded) return null;

  
  return (
    <UserProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1}}>
            <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthProvider>
    </UserProvider>
  )
}
