import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { CachedSvg } from "./CachedSvg";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";


const screenWidth = Dimensions.get('window').width;

export const EditarPerfil = () => {

    const navigation = useNavigation();

    const {userData, setUserData, logout} = useUser();

    const [nombre, setNombre] = useState(userData.nombre)
    const [apellido, setApellido] = useState(userData.apellido)

    const handleGuardarCambios = async () => {
        if (nombre.length <= 0 || apellido.length <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Error al editar perfil',
                text2: 'El nombre o apellido no puede estar vacío',
            });
        } else {
            const docRef = doc(db, 'users', userData.id);
            try {
                await updateDoc(docRef, {
                    nombre: nombre,
                    apellido: apellido
                });
                setUserData({
                    ...userData,
                    nombre: nombre,
                    apellido: apellido
                })
                console.log('Documento actualizado correctamente');
                navigation.replace("Main")
            } catch (error) {
                console.error('Error al actualizar el documento:', error);
            }
        }
    }

    const handleLogout = () => {
        logout();
        navigation.replace("Login")
    }

    return (
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
                <View style={styles.userAvatar}>
                    <CachedSvg uri={userData.avatarUrl} width="170" height="170" />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 25}}>
                    <Text style={{fontFamily: 'Roboto', fontWeight: 'bold', color: '#132337', fontSize: 44, lineHeight: 44}}>{userData.nombre}</Text>
                    <Text style={{fontFamily: 'Roboto', fontWeight: 'bold', color: '#132337', fontSize: 44, lineHeight: 44}}>{userData.apellido}</Text>
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <View style={{...styles.userInfoItem, width: screenWidth * .4, borderRightColor: '#ecececff', borderRightWidth: 1}}>
                        <Text style={styles.userInfoItemLabel}>Nombre  <FontAwesome name="pencil" size={20} color="#363838" /></Text>
                        <TextInput style={styles.userInfoItemValue} onChangeText={setNombre} value={nombre}/>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .4, paddingLeft: 15}}>
                        <Text style={styles.userInfoItemLabel}>Apellido  <FontAwesome name="pencil" size={20} color="#363838" /></Text>
                        <TextInput style={styles.userInfoItemValue} onChangeText={setApellido} value={apellido}/>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Puntos Obtenidos</Text>
                        <Text style={styles.userInfoItemValue}>{userData.puntosObtenidos ? userData.puntosObtenidos : 0} <MaterialCommunityIcons name="medal" size={24} color="#77848D" /></Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Email</Text>
                        <Text style={styles.userInfoItemValue}>{userData.email}</Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Rol</Text>
                        <Text style={styles.userInfoItemValue}>{userData.rol.charAt(0).toUpperCase() + userData.rol.slice(1)}</Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Id del {userData.rol}</Text>
                        <Text style={styles.userInfoItemValue}>{userData.id}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleGuardarCambios}><Text style={styles.buttonGuardar}>Guardar cambios</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}><Text style={styles.buttonCerrarSesion}>Cerrar sesión</Text></TouchableOpacity>
            
        </SafeAreaView>
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
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
        fontWeight: '300',
        backgroundColor: '#fafafa'
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    email: {
        color: 'grey',
        padding: 10,
        fontFamily: 'Roboto',
        fontSize: 19,
        width: 344,
        fontWeight: '300',
    },
    buttonGuardar: {
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
        fontWeight: '500',
        marginTop: 20,
        textAlign: 'center',
    },
    buttonCerrarSesion: {
        backgroundColor: '#e46666',
        width: 320,
        fontFamily: 'Roboto',
        color: '#fafafa',
        padding: 10,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
    },
    userAvatar: {
        width: 170,
        height: 170,
        alignSelf: 'center',
    },
    userInfoItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ecececff',
        paddingVertical: 10
    },
    userInfoItemLabel: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#77848D'
    },
    userInfoItemValue: {
        fontFamily: 'Roboto',
        fontSize: 24,
        color: '#132337',
        fontWeight: 'bold'
    }
})