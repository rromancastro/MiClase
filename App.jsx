import { useFonts } from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto.ttf'),
  });

  if (!fontsLoaded) return null;

  
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  )
}
