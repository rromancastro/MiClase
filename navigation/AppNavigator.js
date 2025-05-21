import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import MainScreen from "../screens/MainScreen";
import CreateAulasScreen from "../screens/CreateAulasScreen";
import EditAccountScreen from "../screens/EditAccountScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="CreateAulas" component={CreateAulasScreen} />
        <Stack.Screen name="EditAccount" component={EditAccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}