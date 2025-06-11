import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useContext, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import emailExists from "../firebase/userExists";
import { AuthContext } from "../contexts/AuthContext";
import { SvgUri } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// utilidad para generar la URL del avatar
const buildAvatarUrl = (config) => {
  const params = new URLSearchParams(config).toString();
  
  return `https://avataaars.io/?avatarStyle=Circle&${params}`;
};

export default function CreateAccountScreen() {

    const {handleSignUp} = useContext(AuthContext);


    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")

    const [email, setEmail] = useState("")
    const [email2, setEmail2] = useState("")

    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [rolValue, setRolValue] = useState("estudiante")

    //logica avatar
    const [avatarConfig, setAvatarConfig] = useState({
        topType: 'NoHair',
        accessoriesType: 'Blank',
        hairColor: 'Brown',
        facialHairType: 'Blank',
        clotheType: 'Hoodie',
        clotheColor: 'Red',
        eyeType: 'Default',
        eyebrowType: 'Default',
        mouthType: 'Smile',
        skinColor: 'Light',
      });

      const avatarConfigStatic = {
        topType: 'NoHair',
        accessoriesType: 'Blank',
        hairColor: 'Brown',
        facialHairType: 'Blank',
        clotheType: 'Hoodie',
        clotheColor: 'Red',
        eyeType: 'Default',
        eyebrowType: 'Default',
        mouthType: 'Smile',
        skinColor: 'Light',
      };
    
      const avatarUrl = buildAvatarUrl(avatarConfig);
    
      const updateTrait = (trait, value) => {
        setAvatarConfig((prev) => ({
          ...prev,
          [trait]: value,
        }));
        console.log(avatarUrl);
        
      };

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
            avatarUrl: avatarUrl
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
                        handleSignUp(email, password)
                        agregarUsuario();
                    }
                }
            }
        }
        }

        
    }

    return (
        <ScrollView>
<View style={styles.container}>
                <SvgUri width="200" height="200" uri={avatarUrl} marginTop={50}/>
                
                <Text style={styles.title}>Crea tu cuenta</Text>
    
                <Text style={styles.avatarConfig}>Color de piel</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('skinColor', 'Pale')} uri={buildAvatarUrl({...avatarConfigStatic, skinColor: 'Pale'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('skinColor', 'Light')} uri={buildAvatarUrl({...avatarConfigStatic, skinColor: 'Light'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('skinColor', 'Brown')} uri={buildAvatarUrl({...avatarConfigStatic, skinColor: 'Brown'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('skinColor', 'DarkBrown')} uri={buildAvatarUrl({...avatarConfigStatic, skinColor: 'DarkBrown'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('skinColor', 'Black')} uri={buildAvatarUrl({...avatarConfigStatic, skinColor: 'Black'})} />
                </View>

                <Text style={styles.avatarConfig}>Tipo de pelo</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('topType', 'WinterHat4')} uri={buildAvatarUrl({...avatarConfigStatic, topType: 'WinterHat4'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('topType', 'LongHairFro')} uri={buildAvatarUrl({...avatarConfigStatic, topType: 'LongHairFro'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('topType', 'LongHairStraight')} uri={buildAvatarUrl({...avatarConfigStatic, topType: 'LongHairStraight'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('topType', 'ShortHairShaggyMullet')} uri={buildAvatarUrl({...avatarConfigStatic, topType: 'ShortHairShaggyMullet'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('topType', 'ShortHairTheCaesar')} uri={buildAvatarUrl({...avatarConfigStatic, topType: 'ShortHairTheCaesar'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('topType', 'ShortHairShortWaved')} uri={buildAvatarUrl({...avatarConfigStatic, topType: 'ShortHairShortWaved'})} />
                </View>

                <Text style={styles.avatarConfig}>Accesorio</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('accessoriesType', 'Blank')} uri={buildAvatarUrl({...avatarConfigStatic, accessoriesType: 'Blank'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('accessoriesType', 'Round')} uri={buildAvatarUrl({...avatarConfigStatic, accessoriesType: 'Round'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('accessoriesType', 'Sunglasses')} uri={buildAvatarUrl({...avatarConfigStatic, accessoriesType: 'Sunglasses'})} />
                </View>

                <Text style={styles.avatarConfig}>Color de pelo</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('hairColor', 'Brown')} uri={buildAvatarUrl({...avatarConfigStatic, hairColor: 'Brown', topType: 'ShortHairShortWaved'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('hairColor', 'BlondeGolden')} uri={buildAvatarUrl({...avatarConfigStatic, hairColor: 'BlondeGolden', topType: 'ShortHairShortWaved'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('hairColor', 'Black')} uri={buildAvatarUrl({...avatarConfigStatic, hairColor: 'Black', topType: 'ShortHairShortWaved'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('hairColor', 'BrownDark')} uri={buildAvatarUrl({...avatarConfigStatic, hairColor: 'BrownDark', topType: 'ShortHairShortWaved'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('hairColor', 'Red')} uri={buildAvatarUrl({...avatarConfigStatic, hairColor: 'Red', topType: 'ShortHairShortWaved'})} />
                </View>

                <Text style={styles.avatarConfig}>Bello facial</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('facialHairType', 'Blank')} uri={buildAvatarUrl({...avatarConfigStatic, facialHairType: 'Blank'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('facialHairType', 'BeardLight')} uri={buildAvatarUrl({...avatarConfigStatic, facialHairType: 'BeardLight'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('facialHairType', 'MoustacheFancy')} uri={buildAvatarUrl({...avatarConfigStatic, facialHairType: 'MoustacheFancy'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('facialHairType', 'MoustacheMagnum')} uri={buildAvatarUrl({...avatarConfigStatic, facialHairType: 'MoustacheMagnum'})} />
                </View>

                <Text style={styles.avatarConfig}>Ropa</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheType', 'BlazerSweater')} uri={buildAvatarUrl({...avatarConfigStatic, clotheType: 'BlazerSweater'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheType', 'ShirtCrewNeck')} uri={buildAvatarUrl({...avatarConfigStatic, clotheType: 'ShirtCrewNeck'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheType', 'Hoodie')} uri={buildAvatarUrl({...avatarConfigStatic, clotheType: 'Hoodie'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheType', 'CollarSweater')} uri={buildAvatarUrl({...avatarConfigStatic, clotheType: 'CollarSweater'})} />
                </View>

                <Text style={styles.avatarConfig}>Color de ropa</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheColor', 'Black')} uri={buildAvatarUrl({...avatarConfigStatic, clotheColor: 'Black'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheColor', 'Blue03')} uri={buildAvatarUrl({...avatarConfigStatic, clotheColor: 'Blue03'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheColor', 'Grey02')} uri={buildAvatarUrl({...avatarConfigStatic, clotheType: 'Grey02'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheColor', 'Red')} uri={buildAvatarUrl({...avatarConfigStatic, clotheColor: 'Red'})} />
                    <SvgUri width={screenWidth * .14} height={screenWidth * .14} onPress={() => updateTrait('clotheColor', 'PastelGreen')} uri={buildAvatarUrl({...avatarConfigStatic, clotheColor: 'PastelGreen'})} />
                </View>


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
    
                <TouchableOpacity onPress={handleCreateUser}><Text style={{...styles.buttonAcceder, marginTop: 20}}>Crear cuenta</Text></TouchableOpacity>
</View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: screenHeight
  },
  title: {
    fontWeight: '700',
    color: '#363838',
    fontFamily: 'Roboto',
    marginBottom: 10,
    fontSize: 35
  },
  avatarConfig: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7E848F',
    fontFamily: 'Roboto',
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
