import { useContext, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import emailExists from "../firebase/userExists";
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig'; // Ajustá la ruta según tu estructura
import { useUser } from '..//contexts/UserContext'; // Contexto que te expliqué antes
import { AuthContext } from "../contexts/AuthContext";
import Toast from "react-native-toast-message";

export default function LoginComponent() {

  const {handleSignIn} = useContext(AuthContext);

  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  //errores

  const { setUserData } = useUser();

  const handleLogin = async () => {
    const existe = await emailExists(email);
    if (!existe) {
      Toast.show({
          type: 'error',
          text1: 'Error al iniciar sesión',
          text2: 'El correo no está registrado',
      });
    } else {
      if (email.length <= 0) {
        Toast.show({
            type: 'error',
            text1: 'Error al iniciar sesión',
            text2: 'El correo no puede estar vacío',
        });
      } else { 
        if (password.length <= 0) {
          Toast.show({
              type: 'error',
              text1: 'Error al iniciar sesión',
              text2: 'La contraseña no puede estar vacía',
          });
        } else {
        try {
      await handleSignIn(email, password);
      console.log("Login correcto");

      // Buscar documento del usuario en Firestore
      const q = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setUserData({...docData, id: querySnapshot.docs[0].id}); // Guardar en contexto
        navigation.replace("Main");
      } else {
        console.log("No se encontró el documento del usuario en Firestore.");
      }
    } catch (error) {
      console.log("Login incorrecto", error);
        Toast.show({
            type: 'error',
            text1: 'Error al iniciar sesión',
            text2: 'El correo o contraseña es incorrecto',
        });
    }
    }}}
  };


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputPassword}
      />
      <TouchableOpacity onPress={handleLogin}><Text style={styles.buttonAcceder}>ACCEDER</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F6F0',
  },
  input: {
    color: 'grey',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DAE3E6',
    outlineStyle: 'none',
    fontFamily: 'Roboto',
    fontSize: 19,
    width: 320,
    fontWeight: '300',
    backgroundColor: '#fafafa'
  },
  inputPassword: {
    color: 'grey',
    padding: 10,
    outlineStyle: 'none',
    fontFamily: 'Roboto',
    fontSize: 19,
    width: 320,
    fontWeight: '300',
    marginBottom: 15,
    backgroundColor: '#fafafa'
  },
  buttonAcceder: {
    backgroundColor: '#4D8CE7',
    width: 320,
    fontFamily: 'Roboto',
    color: '#fafafa',
    padding: 10,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center', 
  }
});
