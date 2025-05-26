import { Animated, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from "react";
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import generateCodeAula from "../helpers/generateCodeAula";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useUser } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";



const screenWidth = Dimensions.get('window').width;

export default function CreateAulasScreen() {

    const navigation = useNavigation();

    const {userData, setUserData} = useUser();

    //logica personalizacion
    const [nombreAula, setNombreAula] = useState('')
    const [nombreAulaError, setNombreAulaError] = useState(false)

    const [icon, setIcon] = useState('book')

    const [color, setColor] = useState("#F09056");

    const colorAnim = useRef(new Animated.Value(0)).current;
    const prevColor = useRef(color);
    const [targetColor, setTargetColor] = useState(color);

    useEffect(() => {
        if (color === prevColor.current) return;

        setTargetColor(color);
        colorAnim.setValue(0);

        Animated.timing(colorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        }).start(() => {
        prevColor.current = color;
        });
    }, [color]);

    const bgColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [prevColor.current, targetColor],
    });

    //subir a firestore
    const handleCrearAula = async () => {
        if (nombreAula.length > 0) {
            setNombreAulaError(false)
            const codigo = await generateCodeAula();

            try {
                const docRef = await addDoc(collection(db, "aulas"), {
                    codigo: codigo,
                    nombre: nombreAula,
                    icono: icon,
                    color: color,
                    nombreProfesor: userData.nombre,
                    apellidoProfesor: userData.apellido,
                    emailProfesor: userData.email,
                    estudiantes: [],
                    createdAt: serverTimestamp(),
                    profesores: [`${userData.nombre} ${userData.apellido}`],
                });
                console.log("Documento agregado con ID:", docRef.id);
                await addDoc(collection(db, "aulas", docRef.id, "chat"), {
                    senderName: 'MiClase',
                    texto: `¡Bienvenido al chat del aula 😁! - "${nombreAula}"`,
                    timestamp: serverTimestamp(),
                    senderId: 0,
                });
                await updateDoc(doc(db, "users", userData.id), {
                    aulas: arrayUnion(docRef.id)
                });
                setUserData({
                    ...userData,
                    aulas: [...userData.aulas, docRef.id]
                })
                navigation.replace("Main")
            } catch (error) {
                console.error("Error al agregar documento:", error);
            }
        } else {
            setNombreAulaError(true)
        }
        
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear aula</Text>
            <Animated.View style={[styles.card, { backgroundColor: bgColor }]}>
                {
                    icon == 'calculator' ?  <Ionicons style={styles.cardIcon} name="calculator" size={180} color="#fafafa" /> :
                    icon == 'book' ? <Entypo style={styles.cardIcon} name="book" onPress={() => {setIcon('book')}} size={180} color="#fafafa" /> :
                    icon == 'world' ? <Fontisto style={styles.cardIcon} name="world" onPress={() => {setIcon('world')}} size={180} color="#fafafa" /> :
                    icon == 'computer' ? <MaterialIcons style={styles.cardIcon} name="computer" onPress={() => {setIcon('computer')}} size={180} color="#fafafa" /> :
                    icon == 'format-letter-case' ? <MaterialCommunityIcons style={styles.cardIcon} name="format-letter-case" onPress={() => {setIcon('format-letter-case')}} size={180} color="#fafafa" /> :
                    icon == 'chemistry' ? <SimpleLineIcons style={styles.cardIcon} name="chemistry" onPress={() => {setIcon('chemistry')}} size={180} color="#fafafa" /> :
                    icon == 'language' ? <FontAwesome style={styles.cardIcon} name="language" onPress={() => {setIcon('language')}} size={180} color="#fafafa" /> :
                    icon == 'musical-notes' ? <Ionicons style={styles.cardIcon} name="musical-notes" onPress={() => {setIcon('musical-notes')}} size={180} color="#fafafa" /> :
                    icon == 'sports-handball' ? <MaterialIcons style={styles.cardIcon} name="sports-handball" onPress={() => {setIcon('sports-handball')}} size={180} color="#fafafa" /> : null
                }
            </Animated.View>
            <TextInput value={nombreAula} maxLength={10} onChangeText={setNombreAula} placeholderTextColor={'grey'} placeholder="Nombre del aula (Max 10 caracteres)" style={styles.nameInput}/>
            {
                nombreAulaError ? <Text style={{color: 'red', fontFamily: 'Roboto'}}>El aula debe tener un nombre</Text> : null
            }
            <TouchableOpacity onPress={handleCrearAula} style={styles.crearButton}><Text style={styles.crearButtonText}>Crear aula</Text></TouchableOpacity>
            <View style={styles.colorAndIconContainer}>
                <View style={styles.colorsContainer}>
                    <Text style={styles.colorsTitle}>Color</Text>
                    <View style={styles.colorSelectContainer}>
                        <TouchableOpacity onPress={() => {setColor('#5190E7')}} style={{...styles.colorSelect, backgroundColor: '#5190E7'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#4A9D67')}} style={{...styles.colorSelect, backgroundColor: '#4A9D67'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#F09056')}} style={{...styles.colorSelect, backgroundColor: '#F09056'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#F16A62')}} style={{...styles.colorSelect, backgroundColor: '#F16A62'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#6060CF')}} style={{...styles.colorSelect, backgroundColor: '#6060CF'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#955196')}} style={{...styles.colorSelect, backgroundColor: '#955196'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#396199')}} style={{...styles.colorSelect, backgroundColor: '#396199'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#393F44')}} style={{...styles.colorSelect, backgroundColor: '#393F44'}}></TouchableOpacity>
                        <TouchableOpacity onPress={() => {setColor('#F4B22C')}} style={{...styles.colorSelect, backgroundColor: '#F4B22C'}}></TouchableOpacity>
                    </View>
                </View>
                <View style={styles.iconsContainer}>
                    <Text style={styles.iconsTitle}>Icono</Text>
                    <View style={styles.iconsSelectContainer}>
                        <Ionicons style={styles.iconSelect} name="calculator" onPress={() => {setIcon('calculator')}} size={30} color="grey" />
                        <Entypo style={styles.iconSelect} name="book" onPress={() => {setIcon('book')}} size={30} color="grey" />
                        <Fontisto style={styles.iconSelect} name="world" onPress={() => {setIcon('world')}} size={30} color="grey" />
                        <MaterialIcons style={styles.iconSelect} name="computer" onPress={() => {setIcon('computer')}} size={30} color="grey" />
                        <MaterialCommunityIcons style={styles.iconSelect} name="format-letter-case" onPress={() => {setIcon('format-letter-case')}} size={30} color="grey" />
                        <SimpleLineIcons style={styles.iconSelect} name="chemistry" onPress={() => {setIcon('chemistry')}} size={30} color="grey" />
                        <FontAwesome style={styles.iconSelect} name="language" onPress={() => {setIcon('language')}} size={30} color="grey" />
                        <Ionicons style={styles.iconSelect} name="musical-notes" onPress={() => {setIcon('musical-notes')}} size={30} color="grey" />
                        <MaterialIcons style={styles.iconSelect} name="sports-handball" onPress={() => {setIcon('sports-handball')}} size={30} color="grey" />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        gap: 20,
        backgroundColor: '#fafafa'
    },
    title: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: '600',
        color: '#272625',
        marginBottom: 20
    },
    card: {
        width: screenWidth * 0.65,
        height: screenWidth * 0.55,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    cardIcon: {
    },
    nameInput: {
        width: screenWidth * 0.85,
        height: 70,
        borderWidth: 1,
        outlineStyle: 'none',
        borderColor: '#E3E8EC',
        borderRadius: 20,
        fontFamily: 'Roboto',
        placeholder: 'grey',
        padding: 20,
        fontSize: 18,
        color: '#272625'
    },
    crearButton: {
        width: screenWidth * 0.85,
        height: 60,
        backgroundColor: '#5090E6',
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    crearButtonText: {
        color: "#fafafa",
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: 600
    },
    colorAndIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    colorsContainer: {
        width: screenWidth * 0.4,
        display: 'flex',
        gap: 10
    },
    colorsTitle: {
        color: '#272625',
        fontSize: 18,
        fontWeight: 600
    },
    colorSelectContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap'
    },
    iconsContainer: {
        width: screenWidth * 0.4,
        display: 'flex',
        gap: 10
    },
    iconsTitle: {
        color: '#272625',
        fontSize: 18,
        fontWeight: 600
    },
    iconsSelectContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap'
    },
    iconSelect: {
        padding: 5,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        width: 45,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    colorSelect: {
        width: 45,
        height: 45,
        borderRadius: 22
    }
})