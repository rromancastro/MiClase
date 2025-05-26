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
        setColorNavBarItemCalendario(navBarItemSelected == 'calendario' ? '#E2E1D9' : '#F8F6F0')
        setColorNavBarItemChat(navBarItemSelected == 'chat' ? '#E2E1D9' : '#F8F6F0')
        setColorNavBarItemUsers(navBarItemSelected == 'users' ? '#E2E1D9' : '#F8F6F0')
    }, [navBarItemSelected])

    
    return <View style={styles.container}>
        <View style={styles.main}>
            {
                navBarItemSelected == 'chat' ? <ChatComponent aulaId={aulaId} /> : 
                navBarItemSelected == 'calendario' ? <Calendario /> :
                navBarItemSelected == 'users' ? <UsersAula /> : null
            }
        </View>
        <View style={styles.navBar}>
            <TouchableOpacity onPress={() => setNavBarItemSelected('calendario')}style={{...styles.navBarItem, backgroundColor: colorNavBarItemCalendario}}>
                <Entypo name="calendar" size={30} color="#C7BDB3" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNavBarItemSelected('chat')}style={{...styles.navBarItem, backgroundColor: colorNavBarItemChat}}>
                <Entypo name="chat" size={30} color="#C7BDB0" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNavBarItemSelected('users')}style={{...styles.navBarItem, backgroundColor: colorNavBarItemUsers}}>
                <FontAwesome6 name="users" size={30} color="#C7BDB0" />
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        height: screenHeight * 0.9,
    },
    navBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: screenHeight * 0.1,
        borderWidth: 1,
        borderColor: '#E2E1D9'
    },
    navBarItem: {
        height: screenHeight * 0.1,
        width: screenWidth * .33,
        borderWidth: 1,
        borderColor: '#E2E1D9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})