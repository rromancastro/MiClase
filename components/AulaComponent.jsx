import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import { ChatComponent } from "./ChatComponent";
import { Calendario } from "./Calendario";
import { UsersAula } from "./UsersComponent";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native";
import { EditarAula } from "./EditarAula";
import { useUser } from "../contexts/UserContext";
import { IniciarJuego } from "./IniciarJuego";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const AulaComponent = ({dataAula}) => {

    const navigation = useNavigation();

    const {userData} = useUser();

    const aulaId = dataAula.id;

    const [section, setSection] = useState('main')

    
    return (<View style={styles.container}>
        {
            section == 'main' ? <View style={{...styles.container, alignItems: 'center'}}>
                <View style={styles.nav}>
                    <TouchableOpacity onPress={() => navigation.replace('Main')}><AntDesign name="arrowleft" size={34} color='#363838' style={styles.navBack} /></TouchableOpacity>
                    <Text style={styles.navText}>{dataAula.nombre} - Codigo: {dataAula.codigo}</Text>
                </View>
                {userData.rol == 'profesor' ? 

                    <TouchableOpacity onPress={() => setSection('editarAula')} style={{...styles.mainItem, backgroundColor: '#4A9D67'}}>
                        <FontAwesome name="pencil" size={34} color="#fafafa" />
                        <Text style={styles.mainItemText}>Editar aula</Text>
                    </TouchableOpacity>
                
                : null}

                {userData.rol == 'profesor' ? 
                
                    <TouchableOpacity onPress={() => setSection('iniciarJuego')} style={{...styles.mainItem, backgroundColor: '#F09056'}}>
                        <Ionicons name="game-controller" size={34} color="#fafafa" />
                        <Text style={styles.mainItemText}>Iniciar juego</Text>
                    </TouchableOpacity>
                
                : null}

                <TouchableOpacity onPress={() => setSection('chat')} style={{...styles.mainItem, backgroundColor: '#396199'}}>
                    <Entypo name="chat" size={34} color="#fafafa" />
                    <Text style={styles.mainItemText}>Chat grupal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSection('users')} style={{...styles.mainItem, backgroundColor: '#F4B22C'}}>
                    <FontAwesome5 name="users" size={34} color="#fafafa" />
                    <Text style={styles.mainItemText}>Participantes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSection('calendario')} style={{...styles.mainItem, backgroundColor: '#F16A62'}}>
                    <FontAwesome6 name="calendar-day" size={34} color="#fafafa" />
                    <Text style={styles.mainItemText}>Calendario</Text>
                </TouchableOpacity>
            </View> :
            section == 'chat' ? <ChatComponent aulaId={aulaId} /> :
            section == 'users' ? <UsersAula dataAula={dataAula}/> :
            section == 'calendario' ? <Calendario /> : 
            section == 'editarAula' ? <EditarAula dataAula={dataAula}/> : 
            section == 'iniciarJuego' ? <IniciarJuego  aulaId={aulaId}/> : null
        }
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: screenWidth * .1,
        height: screenHeight * .08,
        borderBottomColor: '#EFEEE7',
        borderBottomWidth: 1,
        width: screenWidth
    },
    navBack: {
        height: 34,
        width: 34,
    },
    navText: {
        color: '#363838',
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 600,
        marginLeft: 20
    },
    mainItem: {
        borderColor: '#EFEEE7',
        borderWidth: 1,
        width: screenWidth * 0.85,
        height: screenHeight * 0.08,
        borderRadius: 10,
        flexDirection: 'row',
        paddingLeft: 20,
        alignItems: 'center',
    },
    mainItemText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        marginLeft: 20,
        color: '#fafafa'
    },
})