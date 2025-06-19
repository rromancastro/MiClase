import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import LoginComponent from '../components/LoginInput';

export default function LoginScreen({ navigation }) {
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FontAwesome6 name="user" size={60} color="white" style={styles.userIcon}/>
      <Text style={styles.text}>Iniciar sesión</Text>
      <LoginComponent />
      <StatusBar style="dark" />
      <Text style={{fontSize: 18, fontFamily: 'Roboto', color: '#4e4e4e', marginTop: 30}}>¿No tienes cuenta?</Text>
      <TouchableOpacity onPress={() => navigation.replace("CreateAccount")}><Text style={{fontSize: 18, fontFamily: 'Roboto', color: '#4D8CE7', marginTop: 5}}>Crear cuenta</Text></TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  userIcon: {
    backgroundColor: '#4D8CE7',
    paddingVertical: 25,
    paddingHorizontal: 30,
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
