import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useState } from "react";
import { ChatComponent } from "./ChatComponent";
import { Calendario } from "./Calendario";
import { UsersAula } from "./UsersAula";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const ProfesoraAula = ({dataAula}) => {

    const aulaId = dataAula.id;

    //logica colores navbar

    const [colorNavBarItemCalendario, setColorNavBarItemCalendario] = useState('')
    const [colorNavBarItemChat, setColorNavBarItemChat] = useState('')
    const [colorNavBarItemUsers, setColorNavBarItemUsers] = useState('')

    const [navBarItemSelected, setNavBarItemSelected] = useState('chat')

    useEffect(() => {
        setColorNavBarItemCalendario(navBarItemSelected == 'calendario' ? '#E3E5E8' : '#fafafa')
        setColorNavBarItemChat(navBarItemSelected == 'chat' ? '#E3E5E8' : '#fafafa')
        setColorNavBarItemUsers(navBarItemSelected == 'users' ? '#E3E5E8' : '#fafafa')
    }, [navBarItemSelected])

    
    return <View style={styles.container}>
        <Text style={{backgroundColor: dataAula.color, color: '#fafafa', fontWeight: 'bold', textAlign: 'center', fontSize: 20, height: screenHeight * 0.07, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Roboto'}}>{dataAula.nombre} - Prof. {dataAula.apellidoProfesor}</Text>
        <View style={styles.main}>
            {
                navBarItemSelected == 'chat' ? <ChatComponent aulaId={aulaId} /> : 
                navBarItemSelected == 'calendario' ? <Calendario /> :
                navBarItemSelected == 'users' ? <UsersAula dataAula={dataAula}/> : null
            }
        </View>
        <View style={styles.navBar}>
            <TouchableOpacity onPress={() => setNavBarItemSelected('calendario')}style={{...styles.navBarItem, backgroundColor: colorNavBarItemCalendario}}>
                <Entypo name="calendar" size={20} color="#7F8488" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNavBarItemSelected('chat')}style={{...styles.navBarItem, backgroundColor: colorNavBarItemChat}}>
                <Entypo name="chat" size={20} color="#7F8488" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNavBarItemSelected('users')}style={{...styles.navBarItem, backgroundColor: colorNavBarItemUsers}}>
                <FontAwesome6 name="users" size={20} color="#7F8488" />
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        height: screenHeight * 0.88,
    },
    navBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: screenHeight * 0.05,
        borderWidth: 1,
        borderColor: '#E3E5E8'
    },
    navBarItem: {
        height: screenHeight * 0.05,
        width: screenWidth * .33,
        borderWidth: 1,
        borderColor: '#E3E5E8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})