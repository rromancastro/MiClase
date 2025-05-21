import { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import emailExists from "../firebase/userExists";
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig'; // Ajustá la ruta según tu estructura
import { useUser } from '..//contexts/UserContext'; // Contexto que te expliqué antes

export default function LoginComponent() {

  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  //errores
  const [errorCredentials, setErrorCredentials] = useState(false);
  const [emailDontExistsValue, setDontEmailExistsValue] = useState(false);

  const { setUserData } = useUser();

  const handleLogin = async () => {
    setDontEmailExistsValue(false)
    const existe = await emailExists(email);
    if (!existe) {
        setDontEmailExistsValue(true)
    } else {
        try {
      await signInWithEmailAndPassword(auth, email, password);
      setErrorCredentials(false);
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
      setErrorCredentials(true);
    }
    }
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

        {
            errorCredentials ? <Text>La contraseña es incorrecta.</Text> : null
        }
        {
            emailDontExistsValue ? <Text>El correo ingresado no está registrado.</Text> : null
        }

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
    height: 50,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: '500',
  }
});
