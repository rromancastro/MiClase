import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import emailExists from "../firebase/userExists";

export default function CreateAccountScreen({ navigation }) {
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")

    const [email, setEmail] = useState("")
    const [email2, setEmail2] = useState("")

    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [rolValue, setRolValue] = useState("estudiante")


    //errores
    const [emailDistinto, setEmailDistinto] = useState(false)
    const [emailExiste, setEmailExiste] = useState(false)
    const [emailInvalido, setEmailInvalido] = useState(false)

    const [contrasenaDistinta, setContrasenaDistinta] = useState(false)
    const [contrasenaInvalida, setContrasenaInvalida] = useState(false)


    //cargar usuario a coleccion
    const agregarUsuario = async () => {
        try {
            const docRef = await addDoc(collection(db, "users"), {
            email: email,
            rol: rolValue,
            nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase(),
            apellido: apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase(),
            aulas: []
            });
            console.log("Documento agregado con ID:", docRef.id);
        } catch (error) {
            console.error("Error al agregar documento:", error);
        }
    };

    //crear usuario
    const handleCreateUser = async () => {
        const existe = await emailExists(email);
        if (existe) {
            setEmailExiste(true)
        } else {
            setEmailExiste(false)
            if (email !== email2) {
            setEmailDistinto(true)
        } else {
            setEmailDistinto(false)
            if (!email.includes("@") || email.length <= 0 || !email.includes(".com")) {
                setEmailInvalido(true)
            } else {
                setEmailInvalido(false)
                if (password !== password2) {
                    setContrasenaDistinta(true)
                } else {
                    setContrasenaDistinta(false)
                    if (password.length < 8) {
                        setContrasenaInvalida(true)
                    }
                    else {
                        setContrasenaInvalida(false)
                        createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            agregarUsuario();
                            navigation.replace("Login")
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorCode + errorMessage)
                        });   
                    }
                }
            }
        }
        }

        
    }

    const handleCreateUser4 = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage)
            });   
    }


    return (
        <View style={styles.container}>
            <AntDesign name="adduser" size={60} color="white" style={styles.userIcon}/>

            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput style={styles.input} 
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}/>
            <TextInput style={{...styles.input, marginBottom: '20px'}} 
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}/>

            <TextInput style={styles.input} 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"/>
            <TextInput style={{...styles.input, marginBottom: '20px'}} 
                placeholder="Repetir email"
                value={email2}
                onChangeText={setEmail2}
                autoCapitalize="none"
                keyboardType="email-address"/>

            <TextInput style={styles.input} 
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry/>
            <TextInput style={{...styles.input, marginBottom: '20px'}} 
                placeholder="Repetir contraseña"
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry/>

            <View style={styles.rolContainer}>
                <Text style={styles.pickerLabel}>Rol:</Text>
                <Picker
                    selectedValue={rolValue}
                    style={styles.picker}
                    onValueChange={(itemValue) => setRolValue(itemValue)}
                >
                    <Picker.Item label="Estudiante" value="estudiante" />
                    <Picker.Item label="Profesor" value="profesor" />
                </Picker>
            </View>

            {
                emailDistinto == true ? <Text style={styles.errorText}t>Los correos no coinciden</Text> : null
            }
            {
                emailExiste == true ? <Text style={styles.errorText}t>Este correo ya está registrado</Text> : null
            }
            {
                emailInvalido == true ? <Text style={styles.errorText}>El correo es invalido</Text> : null
            }
            {
                contrasenaDistinta == true ? <Text style={styles.errorText}>Las contraseñas no coinciden</Text> : null
            }
            {
                contrasenaInvalida == true ? <Text style={styles.errorText}>La contraseña debe tener al menos 8 caracteres</Text> : null
            }

            <TouchableOpacity onPress={handleCreateUser}><Text style={{...styles.buttonAcceder, marginTop: '20px'}}>Crear cuenta</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  title: {
    fontWeight: '700',
    color: '#363838',
    fontFamily: 'Roboto',
    marginBottom: 30,
    fontSize: 35
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
    fontWeight: '300'
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
  },
  rolContainer: {
    flexDirection: 'row',
    gap: 5
  },
  pickerLabel: {
    fontSize: 19,
    fontWeight: '700',
    color: '#363838',
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  picker: {
    border: 'none',
    backgroundColor: '#fafafa',
    fontFamily: 'Roboto',
    fontSize: 19,
    outlineStyle: 'none',
    color: 'grey',
  },
  errorText: {
    fontSize: 19,
    fontFamily: 'Roboto',
    color: 'red',
    padding: 10
  }
});
