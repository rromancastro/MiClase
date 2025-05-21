import { StyleSheet, Text, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useUser } from "../contexts/UserContext";
import { TextInput } from "react-native-web";
import { useState } from "react";

export default function EditAccountScreen() {

    const {userData, setUserData} = useUser();

    const [nombre, setNombre] = useState(userData.nombre)
    const [apellido, setApellido] = useState(userData.apellido)

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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
    }
})