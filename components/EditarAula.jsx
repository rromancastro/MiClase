import { Animated, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from "react";
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { arrayRemove, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useUser } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";



const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const EditarAula = ({dataAula}) => {

    const navigation = useNavigation();

    const {userData, setUserData} = useUser();

    //logica personalizacion
    const [nombreAula, setNombreAula] = useState(dataAula.nombre)
    const [icon, setIcon] = useState(dataAula.icono)

    const [color, setColor] = useState(dataAula.color);

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

    const handleEditarAula = async () => {
        if (nombreAula.length > 0) {

            try {
                    await updateDoc(doc(db, "aulas", dataAula.id), {
                        nombre: nombreAula,
                        icono: icon,
                        color: color,
                    });

                    console.log("Aula actualizada con ID:", dataAula.id);
                    navigation.replace("Aula", {aulaId: dataAula.id})
                } catch (error) {
                    console.error("Error al actualizar el aula:", error);
                }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error al editar aula',
                text2: 'El nombre no puede estar vacío',
            });
        }
    };

    const eliminarSubcoleccionChat = async (coleccionRef) => {
        const snapshot = await getDocs(coleccionRef);
        const batchDeleciones = [];

        snapshot.forEach((documento) => {
            batchDeleciones.push(deleteDoc(documento.ref));
        });

        await Promise.all(batchDeleciones);
    };

    const handleEliminarAula = async () => {
        try {

            eliminarSubcoleccionChat(doc(db, "aulas", dataAula.id, "chat"));

            await deleteDoc(doc(db, "aulas", dataAula.id));
            console.log("Aula eliminada con ID:", dataAula.id);

            await updateDoc(doc(db, "users", userData.id), {
                aulas: arrayRemove(dataAula.id)
            });
            
            setUserData({
                ...userData,
                aulas: userData.aulas.filter(id => id !== dataAula.id)
            })

            navigation.replace("Main");
        } catch (error) {
            console.error("Error al eliminar el aula:", error);
        }
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <Animated.View style={[styles.card, { backgroundColor: bgColor, width: screenWidth * 0.85, height: 200, borderRadius: 30, padding: 20, justifyContent: 'flex-end', marginVertical: 20,
boxShadow: '3px 3px 0px #DBDCDC' }]}>
                    {
                        icon == 'calculator' ?  <Ionicons style={styles.cardIcon} name="calculator" size={30} color="#fafafa" /> :
                        icon == 'book' ? <Entypo style={styles.cardIcon} name="book" onPress={() => {setIcon('book')}} size={30} color="#fafafa" /> :
                        icon == 'world' ? <Fontisto style={styles.cardIcon} name="world" onPress={() => {setIcon('world')}} size={30} color="#fafafa" /> :
                        icon == 'computer' ? <MaterialIcons style={styles.cardIcon} name="computer" onPress={() => {setIcon('computer')}} size={30} color="#fafafa" /> :
                        icon == 'format-letter-case' ? <MaterialCommunityIcons style={styles.cardIcon} name="format-letter-case" onPress={() => {setIcon('format-letter-case')}} size={30} color="#fafafa" /> :
                        icon == 'chemistry' ? <SimpleLineIcons style={styles.cardIcon} name="chemistry" onPress={() => {setIcon('chemistry')}} size={30} color="#fafafa" /> :
                        icon == 'language' ? <FontAwesome style={styles.cardIcon} name="language" onPress={() => {setIcon('language')}} size={30} color="#fafafa" /> :
                        icon == 'musical-notes' ? <Ionicons style={styles.cardIcon} name="musical-notes" onPress={() => {setIcon('musical-notes')}} size={30} color="#fafafa" /> :
                        icon == 'sports-handball' ? <MaterialIcons style={styles.cardIcon} name="sports-handball" onPress={() => {setIcon('sports-handball')}} size={30} color="#fafafa" /> : null
                    }
                    <Text style={{fontFamily: 'Roboto', fontSize: 49, alignSelf: 'flex-start', fontWeight: '700', color: '#fafafa'}}>{dataAula.nombre}</Text>
                    <Text style={{fontFamily: 'Roboto', fontSize: 18, alignSelf: 'flex-start', color: '#fafafa'}}>Código: {dataAula.codigo}</Text>
                </Animated.View>
                <View style={{gap: 10}}>
                    <Text style={styles.iconsTitle}>Nombre</Text>
                    <TextInput value={nombreAula} maxLength={10} onChangeText={setNombreAula} placeholderTextColor={'grey'} placeholder="Nombre del aula (Max 10 caracteres)" style={styles.nameInput}/>
                </View>
                    <View style={{gap: 10, height: 80}}>
                        <Text style={styles.colorsTitle}>Color</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{gap: 10}}>
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
                        </ScrollView>
                    </View>
                        <View style={{gap: 10, height: 80}}>
                            <Text style={styles.iconsTitle}>Icono</Text>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{gap: 10}}>
                                <View style={styles.iconsSelectContainer}>
                                    <Ionicons style={styles.iconSelect} name="calculator" onPress={() => {setIcon('calculator')}} size={35} color="grey" />
                                    <Entypo style={styles.iconSelect} name="book" onPress={() => {setIcon('book')}} size={35} color="grey" />
                                    <Fontisto style={styles.iconSelect} name="world" onPress={() => {setIcon('world')}} size={35} color="grey" />
                                    <MaterialIcons style={styles.iconSelect} name="computer" onPress={() => {setIcon('computer')}} size={35} color="grey" />
                                    <MaterialCommunityIcons style={styles.iconSelect} name="format-letter-case" onPress={() => {setIcon('format-letter-case')}} size={35} color="grey" />
                                    <SimpleLineIcons style={styles.iconSelect} name="chemistry" onPress={() => {setIcon('chemistry')}} size={35} color="grey" />
                                    <FontAwesome style={styles.iconSelect} name="language" onPress={() => {setIcon('language')}} size={35} color="grey" />
                                    <Ionicons style={styles.iconSelect} name="musical-notes" onPress={() => {setIcon('musical-notes')}} size={35} color="grey" />
                                    <MaterialIcons style={styles.iconSelect} name="sports-handball" onPress={() => {setIcon('sports-handball')}} size={35} color="grey" />
                                </View>
                            </ScrollView>
                        </View>
                <TouchableOpacity onPress={handleEditarAula} style={styles.crearButton}><Text style={styles.crearButtonText}>Guardar cambios</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleEliminarAula} style={styles.eliminarButton}><Text style={styles.crearButtonText}>Eliminar aula</Text></TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        gap: 20,
    },
    title: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: '600',
        color: '#272625',
        marginVertical: 20
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        padding: 10,
        backgroundColor: 'rgba(250, 250, 250, 0.2)',
        position: 'absolute',
        top: 20,
        left: 20
    },
    nameInput: {
        width: screenWidth * 0.85,
        height: 70,
        outlineStyle: 'none',
        backgroundColor: '#fafafa',
        borderRadius: 20,
        fontFamily: 'Roboto',
        placeholder: 'grey',
        padding: 23,
        fontSize: 18,
        color: '#272625',
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    crearButton: {
        width: screenWidth * 0.85,
        height: 60,
        backgroundColor: '#5090E6',
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    eliminarButton: {
        width: screenWidth * 0.85,
        height: 60,
        backgroundColor: '#e46666',
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '3px 3px 0px #DBDCDC'
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
        backgroundColor: "#fafafa",
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