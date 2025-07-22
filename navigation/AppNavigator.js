import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import MainScreen from "../screens/MainScreen";
import AulaScreen from "../screens/AulaScreen";
import JuegoScreen from "../screens/JuegoScreen";
import IniciarJuegoScreen from "../screens/IniciarJuegoScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Aula" component={AulaScreen} />
        <Stack.Screen name="IniciarJuego" component={IniciarJuegoScreen} />
        <Stack.Screen name="Juego" component={JuegoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}