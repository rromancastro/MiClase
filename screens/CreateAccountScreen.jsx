import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import emailExists from "../firebase/userExists";

export default function CreateAccountScreen({ navigation }) {

    const [avatarId, setAvatarId] = useState(require('../assets/avatars/1.png'))

    const avatarsIds = {
        '1': require('../assets/avatars/1.png'),
        '2': require('../assets/avatars/2.png'),
        '3': require('../assets/avatars/3.png'),    
        '4': require('../assets/avatars/4.png'),
        '5': require('../assets/avatars/5.png'),
        '6': require('../assets/avatars/6.png'),
        '7': require('../assets/avatars/7.png'),
        '8': require('../assets/avatars/8.png'),
        '9': require('../assets/avatars/9.png'),
        '10': require('../assets/avatars/10.png'),
        '11': require('../assets/avatars/11.png'),
        '12': require('../assets/avatars/12.png'),
        '13': require('../assets/avatars/13.png'),
        '14': require('../assets/avatars/14.png'),  
        '15': require('../assets/avatars/15.png'),
        '16': require('../assets/avatars/16.png'),
        '17': require('../assets/avatars/17.png'),
        '18': require('../assets/avatars/18.png'),
        '19': require('../assets/avatars/19.png'),
        '20': require('../assets/avatars/20.png'),
        '21': require('../assets/avatars/21.png'),
        '22': require('../assets/avatars/22.png'),
        '23': require('../assets/avatars/23.png'),
        '24': require('../assets/avatars/24.png'),
        '25': require('../assets/avatars/25.png'),
        '26': require('../assets/avatars/26.png'),
        '27': require('../assets/avatars/27.png'),
    };

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
            aulas: [],
            avatarRequired: avatarId,
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
            <View style={styles.userAvatarContainer}>
                <Image source={avatarId} style={styles.userAvatar}/> 
            </View>

            <Text style={styles.title}>Crear cuenta</Text>

            <View style={styles.avatarSelectContainer}>
            {Object.keys(avatarsIds).map((id)  => (
                <TouchableOpacity key={id} onPress={() => setAvatarId(avatarsIds[id])}>
                <Image
                    source={avatarsIds[id]}
                    style={{
                    ...styles.userAvatar,
                    width: 40,
                    height: 40,
                    margin: 5,
                    borderRadius: 10,
                    borderWidth: avatarId === id ? 2 : 0,
                    borderColor: '#4D8CE7',
                    }}
                />
                </TouchableOpacity>
            ))}
            </View>


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
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarContainer: {
    backgroundColor: '#4D8CE7',
    width: 120,
    height: 120,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 90,
    height: 90,
  },
  avatarSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'center',
    
  },
  title: {
    fontWeight: '700',
    color: '#363838',
    fontFamily: 'Roboto',
    marginBottom: 20,
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
