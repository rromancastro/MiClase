import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import LoginComponent from '../components/LoginInput';

export default function LoginScreen({ navigation }) {
  

  return (
    <View style={styles.container}>
      <FontAwesome6 name="user" size={60} color="white" style={styles.userIcon}/>
      <Text style={styles.text}>Iniciar sesión</Text>
      <LoginComponent />
      <StatusBar style="dark" />
      <Text style={{fontSize: '18px', fontFamily: 'Roboto', color: '#4e4e4e', marginTop: '30px'}}>¿No tienes cuenta?</Text>
      <TouchableOpacity onPress={() => navigation.replace("CreateAccount")}><Text style={{fontSize: '18px', fontFamily: 'Roboto', color: '#4D8CE7', marginTop: '5px'}}>Crear cuenta</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  userIcon: {
    backgroundColor: '#4D8CE7',
    width: 100,
    height: 100,
    padding: 20,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    color: '#363838',
    fontFamily: 'Roboto',
    marginBottom: 30,
    fontSize: 35
  },
});
