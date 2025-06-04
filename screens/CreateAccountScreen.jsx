import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import emailExists from "../firebase/userExists";

const screenWidth = Dimensions.get('window').width;

export default function CreateAccountScreen({ navigation }) {

    const [avatarId, setAvatarId] = useState(require('../assets/avatars/1.png'))
    const [mostrarAvatars, setMostrarAvatars] = useState(false)

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

    return (
        <View style={styles.container}>
            <View style={styles.userAvatarContainer}>
                <Image source={avatarId} style={styles.userAvatar}/> 
            </View>

            <Text style={styles.title}>Crear cuenta</Text>

            <TouchableOpacity onPress={()=>setMostrarAvatars(!mostrarAvatars)}><Text style={styles.avatarSelectButton}>Elegir avatar</Text></TouchableOpacity>

            {mostrarAvatars ? <View on style={styles.avatarSelectContainer}>
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
            </View> : null}


            <View style={styles.inputContainer}>
                <FontAwesome5 name="user-alt" size={24} color="#7E848F" />
                <TextInput style={styles.input} 
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}/>
            </View>

            <View style={styles.inputContainer}>
                <FontAwesome5 name="user-alt" size={24} color="#7E848F" />
                <TextInput style={styles.input} 
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}/>
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#7E848F" />
                <TextInput style={styles.input} 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"/>
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#7E848F" />
                <TextInput style={styles.input} 
                placeholder="Repetir email"
                value={email2}
                onChangeText={setEmail2}
                autoCapitalize="none"
                keyboardType="email-address"/>
            </View>

            <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={24} color="#7E848F" />
                <TextInput style={styles.input} 
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry/>
            </View>

            <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={24} color="#7E848F" />
                <TextInput style={styles.input} 
                placeholder="Repetir contraseña"
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry/>
            </View>

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
    backgroundColor: '#FBFBFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarContainer: {
    backgroundColor: '#4D8CE7',
    width: 140,
    height: 140,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 110,
    height: 110,
  },
  avatarSelectButton:{
    fontFamily: 'Roboto',
    backgroundColor: '#EBEEF2',
    color: '#363838',
    fontSize: 20,
    fontWeight: 600,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  avatarSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: screenWidth * 0.9,
    borderRadius: 10,
    marginTop: 50,
    position: 'absolute',
    zIndex: 10
  },
  title: {
    fontWeight: '700',
    color: '#363838',
    fontFamily: 'Roboto',
    marginBottom: 10,
    fontSize: 35
  },
  inputContainer:{
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
    paddingHorizontal: 10
  },
  input: {
    color: 'grey',
    padding: 10,
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    width: 340,
    gap: 10,
    paddingHorizontal:20,
    paddingVertical: 10
  },
  pickerLabel: {
    fontSize: 19,
    fontWeight: '700',
    backgroundColor: '#FFFFFF',
    color: '#7E848F',
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  picker: {
    border: 'none',
    backgroundColor: '#FFFFFF',
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
