import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useUser } from "../contexts/UserContext";
import { TextInput } from "react-native-web";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export const EditarPerfil = () => {

    const navigation = useNavigation();

    const {userData, setUserData, logout} = useUser();

    const [nombre, setNombre] = useState(userData.nombre)
    const [apellido, setApellido] = useState(userData.apellido)

    const handleGuardarCambios = async () => {
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

    const handleLogout = () => {
        logout();
        navigation.replace("Login")
    }

    return (
        <View style={styles.container}>
            <FontAwesome6 name="user" size={60} color="white" style={styles.userIcon}/>
            <Text style={styles.title}>Mi Cuenta</Text>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} onChangeText={setNombre} value={nombre}/>
                <FontAwesome name="pencil" size={24} color="#363838" />
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} onChangeText={setApellido} value={apellido}/>
                <FontAwesome name="pencil" size={24} color="#363838" />
            </View>
            <Text style={styles.email}>{userData.email}</Text>
            <TouchableOpacity onPress={handleGuardarCambios}><Text style={styles.buttonGuardar}>Guardar cambios</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}><Text style={styles.buttonCerrarSesion}>Cerrar sesión</Text></TouchableOpacity>
        </View>
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
        height: 50,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: '500',
        marginTop: 20
    },
    buttonCerrarSesion: {
        backgroundColor: '#e46666',
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
})