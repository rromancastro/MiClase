import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { Loader } from "../components/Loader";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// utilidad para generar la URL del avatar
const buildAvatarUrl = (config) => {
  const params = new URLSearchParams(config).toString();
  
  return `https://avataaars.io/?avatarStyle=Circle&${params}`;
};

export default function CreateAccountScreen() {

    const navigation = useNavigation();

    const {handleSignUp} = useContext(AuthContext);

    const [loadingAvatar, setLoadingAvatar] = useState(true)


    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")

    const [email, setEmail] = useState("")
    const [email2, setEmail2] = useState("")

    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [section, setSection] = useState("data")

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

      //logica barra avatar
      const [avatarSection, setAvatarSection] = useState("Piel");
      const avatarOptions = ["Piel", "Peinado", "Ojos", "Boca", "Accesorios", "Vestimenta"]

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
                        navigation.replace("Login");
                    }
                }
            }
        }
        }

        
    }

    return (<ScrollView style={{flex: 1, backgroundColor: '#FBFBFB'}}>
<View style={styles.container}>
                {
                    loadingAvatar ? <View style={{width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
                        <Loader />
                    </View> : null
                }
                <SvgUri onLoad={() => setLoadingAvatar(false)} width="200" height="200" uri={avatarUrl} marginTop={30}/>
                
                <Text style={styles.title}>Crea tu cuenta</Text>
                <View style={{flexDirection: 'row', gap: 10, marginBottom: 20}}>
                    <TouchableOpacity onPress={() => setSection('data')}><Text style={{padding: 10, color: '#fafafa', borderRadius: 10, backgroundColor: section =='data' ? '#4D8CE7' : '#888A88' }}>Información</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setSection('avatar')}><Text style={{padding: 10, color: '#fafafa', borderRadius: 10, backgroundColor: section =='avatar' ? '#4D8CE7' : '#888A88' }}>Avatar</Text></TouchableOpacity>
                </View>
                {section == 'avatar' ? <View >

                    <View style={{height: 30}}>
                        <FlatList
                            data={avatarOptions}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingLeft: screenWidth / 2.4 , paddingRight: screenWidth / 2.4 }}
                            renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setAvatarSection(item)}>
                                <Text style={{marginHorizontal: 20, fontWeight: '700', fontSize: 16, fontFamily: 'Roboto', color: avatarSection === item ? '#4D8CE7' : '#888A88'}}>{item}</Text>
                            </TouchableOpacity>
                            )}
                        />
                    </View>

                    {
                    avatarSection === "Piel" ? 
                    <View style={{flexDirection: 'row', marginTop: 20 ,gap: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <TouchableOpacity onPress={() => updateTrait('skinColor', 'Pale')} style={{...styles.buttonPiel, backgroundColor: "#FFDBB4"}} />
                        <TouchableOpacity onPress={() => updateTrait('skinColor', 'Light')} style={{...styles.buttonPiel, backgroundColor: "#EDB98A"}} />
                        <TouchableOpacity onPress={() => updateTrait('skinColor', 'Brown')} style={{...styles.buttonPiel, backgroundColor: "#D08B5B"}} />
                        <TouchableOpacity onPress={() => updateTrait('skinColor', 'DarkBrown')} style={{...styles.buttonPiel, backgroundColor: "#AE5D29"}} />
                        <TouchableOpacity onPress={() => updateTrait('skinColor', 'Black')} style={{...styles.buttonPiel, backgroundColor: "#614335"}} />
                        <TouchableOpacity onPress={() => updateTrait('skinColor', 'Tanned')} style={{...styles.buttonPiel, backgroundColor: "#FD9841"}} />
                        <TouchableOpacity onPress={() => updateTrait('skinColor', 'Yellow')} style={{...styles.buttonPiel, backgroundColor: "#F8D25C"}} />
                    </View> :
                    
                    avatarSection === "Peinado" ?<View>
                    <View style={{flexDirection: 'row', gap: 20, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: 'black'}}  onPress={() => updateTrait('hairColor', 'Black')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#5C4641'}}  onPress={() => updateTrait('hairColor', 'BrownDark')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#805447'}}  onPress={() => updateTrait('hairColor', 'Brown')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#DABB7E'}}  onPress={() => updateTrait('hairColor', 'BlondeGolden')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#CE471E'}}  onPress={() => updateTrait('hairColor', 'Red')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#EAE4E4'}}  onPress={() => updateTrait('hairColor', 'SilverGray')}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20 ,gap: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'NoHair')}><Image source={require('../assets/avatars/pelo1.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'WinterHat3')}><Image source={require('../assets/avatars/pelo2.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'Hat')}><Image source={require('../assets/avatars/pelo3.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'LongHairFro')}><Image source={require('../assets/avatars/pelo4.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'LongHairBob')}><Image source={require('../assets/avatars/pelo5.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'LongHairStraight')}><Image source={require('../assets/avatars/pelo6.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'ShortHairShortWaved')}><Image source={require('../assets/avatars/pelo7.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'ShortHairTheCaesar')}><Image source={require('../assets/avatars/pelo8.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('topType', 'ShortHairShortRound')}><Image source={require('../assets/avatars/pelo9.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                    </View> </View> : 

                    avatarSection === "Ojos" ? 
                    <View style={{flexDirection: 'row', marginTop: 20 ,gap: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'Default')}><Image source={require('../assets/avatars/ojos1.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'EyeRoll')}><Image source={require('../assets/avatars/ojos2.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'Happy')}><Image source={require('../assets/avatars/ojos3.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'Hearts')}><Image source={require('../assets/avatars/ojos4.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'Side')}><Image source={require('../assets/avatars/ojos5.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'Squint')}><Image source={require('../assets/avatars/ojos6.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'Wink')}><Image source={require('../assets/avatars/ojos7.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'WinkWacky')}><Image source={require('../assets/avatars/ojos8.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('eyeType', 'Surprised')}><Image source={require('../assets/avatars/ojos9.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                    </View> :

                    avatarSection === "Boca" ? 
                    <View style={{flexDirection: 'row', marginTop: 20 ,gap: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <TouchableOpacity onPress={() => updateTrait('mouthType', 'Default')}><Image source={require('../assets/avatars/boca1.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('mouthType', 'Eating')}><Image source={require('../assets/avatars/boca2.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('mouthType', 'Grimace')}><Image source={require('../assets/avatars/boca3.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('mouthType', 'Serious')}><Image source={require('../assets/avatars/boca4.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('mouthType', 'Smile')}><Image source={require('../assets/avatars/boca5.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('mouthType', 'Tongue')}><Image source={require('../assets/avatars/boca6.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('mouthType', 'Twinkle')}><Image source={require('../assets/avatars/boca7.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                    </View> : 

                    avatarSection === "Accesorios" ? 
                    <View style={{flexDirection: 'row', marginTop: 20 ,gap: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <TouchableOpacity onPress={() => updateTrait('accessoriesType', 'Default')}><Image source={require('../assets/avatars/lentes1.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('accessoriesType', 'Kurt')}><Image source={require('../assets/avatars/lentes2.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('accessoriesType', 'Prescription01')}><Image source={require('../assets/avatars/lentes3.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('accessoriesType', 'Prescription02')}><Image source={require('../assets/avatars/lentes4.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('accessoriesType', 'Round')}><Image source={require('../assets/avatars/lentes5.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('accessoriesType', 'Sunglasses')}><Image source={require('../assets/avatars/lentes6.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('accessoriesType', 'Wayfarers')}><Image source={require('../assets/avatars/lentes7.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                    </View> : 

                    
                    avatarSection === "Vestimenta" ?<View>
                    <View style={{flexDirection: 'row', gap: 20, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#262E33'}}  onPress={() => updateTrait('clotheColor', 'Black')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#25557C'}}  onPress={() => updateTrait('clotheColor', 'Blue03')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#929598'}}  onPress={() => updateTrait('clotheColor', 'Gray02')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#A7FFC4'}}  onPress={() => updateTrait('clotheColor', 'PastelGreen')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#FF488E'}}  onPress={() => updateTrait('clotheColor', 'PinkRed')}/>
                        <TouchableOpacity style={{...styles.buttonColor, backgroundColor: '#FF5C5C'}}  onPress={() => updateTrait('clotheColor', 'Red')}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20 ,gap: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <TouchableOpacity onPress={() => updateTrait('clotheType', 'BlazerShirt')}><Image source={require('../assets/avatars/ropa1.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('clotheType', 'BlazerSweater')}><Image source={require('../assets/avatars/ropa2.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('clotheType', 'CollarSweater')}><Image source={require('../assets/avatars/ropa3.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('clotheType', 'Hoodie')}><Image source={require('../assets/avatars/ropa5.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('clotheType', 'Overall')}><Image source={require('../assets/avatars/ropa6.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('clotheType', 'ShirtCrewNeck')}><Image source={require('../assets/avatars/ropa7.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => updateTrait('clotheType', 'ShirtVNeck')}><Image source={require('../assets/avatars/ropa9.png')} style={styles.avatarConfigButton}/></TouchableOpacity>
                    </View> </View> : null
                
                    }
                
                </View>

                : <View>

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
                    emailDistinto == true ? <Text style={styles.errorText}>Los correos no coinciden</Text> : null
                }
                {
                    emailExiste == true ? <Text style={styles.errorText}>Este correo ya está registrado</Text> : null
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
                <TouchableOpacity onPress={handleCreateUser}><Text style={{...styles.buttonAcceder, marginVertical: 20, alignSelf: 'center'}}>Crear cuenta</Text></TouchableOpacity>
                
                </View>}
    
</View>
    </ScrollView>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    alignItems: 'center',
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
  buttonPiel: {
    width: screenWidth * .26,
    height: screenWidth * .26,
    borderRadius: (screenWidth * .20) / 2,
  },
  avatarConfigButton: {
    width: screenWidth * .26,
    height: screenWidth * .26,
  },
  buttonColor: {
    width: screenWidth * .1,
    height: screenWidth * .1,
    borderRadius: (screenWidth * .1) / 2,
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
    paddingVertical: 10,
    fontFamily: 'Roboto',
    color: '#fafafa',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
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
    width: 250,
    height: 50,
  },
  errorText: {
    fontSize: 19,
    fontFamily: 'Roboto',
    color: 'red',
    padding: 10,
  }
});
