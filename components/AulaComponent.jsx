import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import { ChatComponent } from "./ChatComponent";
import { Calendario } from "./Calendario";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { UsersAula } from "./UsersComponent";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native";
import { EditarAula } from "./EditarAula";
import { useUser } from "../contexts/UserContext";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const AulaComponent = ({dataAula}) => {

    const navigation = useNavigation();

    const {userData} = useUser();

    const aulaId = dataAula.id;

    const [section, setSection] = useState('main')

    
    return (<View style={styles.container}>
        {
            section == 'main' ? <View style={styles.container}>
                <View style={{backgroundColor: dataAula.color, width: screenWidth * 0.85, height: 200, borderRadius: 30, padding: 20, justifyContent: 'flex-end', marginVertical: 20, boxShadow: '3px 3px 0px #DBDCDC'}}>
                    {
                    dataAula.icono == 'calculator' ?  <Ionicons style={styles.cardIcon} name="calculator" size={30} color="#fafafa"/> :
                    dataAula.icono == 'book' ? <Entypo style={styles.cardIcon} name="book" size={30} color="#fafafa"/> :
                    dataAula.icono == 'world' ? <Fontisto style={styles.cardIcon} name="world" size={30} color="#fafafa"/> :
                    dataAula.icono == 'computer' ? <MaterialIcons style={styles.cardIcon} name="computer" size={30} color="#fafafa"/> :
                    dataAula.icono == 'format-letter-case' ? <MaterialCommunityIcons style={styles.cardIcon} name="format-letter-case" size={100} color="#fafafa"/> :
                    dataAula.icono == 'chemistry' ? <SimpleLineIcons style={styles.cardIcon} name="chemistry" size={30} color="#fafafa"/> :
                    dataAula.icono == 'language' ? <FontAwesome style={styles.cardIcon} name="language" size={30} color="#fafafa"/> :
                    dataAula.icono == 'musical-notes' ? <Ionicons style={styles.cardIcon} name="musical-notes" size={30} color="#fafafa"/> :
                    dataAula.icono == 'sports-handball' ? <MaterialIcons style={styles.cardIcon} name="sports-handball" size={30} color="#fafafa"/> : null
                    }
                    <Text style={{fontFamily: 'Roboto', fontSize: 49, alignSelf: 'flex-start', fontWeight: '700', color: '#fafafa'}}>{dataAula.nombre}</Text>
                    <Text style={{fontFamily: 'Roboto', fontSize: 18, alignSelf: 'flex-start', color: '#fafafa'}}>Código: {dataAula.codigo}</Text>
                </View>
                
                <View style={{gap: 10, marginBottom: 20}}>
                    <Text style={styles.subtitle}>Gestión del aula</Text>
                    {userData.rol == 'profesor' ?
                        <TouchableOpacity onPress={() => setSection('editarAula')} style={styles.mainItem}>
                            <FontAwesome name="pencil" width={40} size={34} color="#4EAB87" />
                            <Text style={styles.mainItemText}>Editar aula</Text>
                        </TouchableOpacity>
                    
                    : null}
                    <TouchableOpacity onPress={() => setSection('users')} style={styles.mainItem}>
                        <FontAwesome5 name="users" width={40} size={30} color="#516169" />
                        <Text style={styles.mainItemText}>Participantes</Text>
                    </TouchableOpacity>
                </View>

                <View style={{gap: 10, marginBottom: 20}}>
                    <Text style={styles.subtitle}>Actividades</Text>
                    {userData.rol == 'profesor' ?
                    
                        <TouchableOpacity onPress={() => navigation.navigate("IniciarJuego", {aulaId: dataAula.id})} style={styles.mainItem}>
                            <Ionicons name="game-controller" size={34} color="#F2B569" />
                            <Text style={styles.mainItemText}>Iniciar juego</Text>
                        </TouchableOpacity>
                    
                    : null}
                    <TouchableOpacity onPress={() => setSection('calendario')} style={styles.mainItem}>
                        <FontAwesome6 name="calendar-day" size={34} color="#EB644A" />
                        <Text style={styles.mainItemText}>Calendario</Text>
                    </TouchableOpacity>
                </View>

                <View style={{gap: 10, marginBottom: 20}}>    
                    <Text style={styles.subtitle}>Comunicación</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Chat", {aulaId: dataAula.id})} style={styles.mainItem}>
                        <Entypo name="chat" size={34} color="#597CB9" />
                        <Text style={styles.mainItemText}>Chat grupal</Text>
                    </TouchableOpacity>
                </View>
            </View> :
            section == 'users' ? <UsersAula dataAula={dataAula}/> :
            section == 'calendario' ? <Calendario dataAula={dataAula} /> : 
            section == 'editarAula' ? <EditarAula dataAula={dataAula}/> : null
        }
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    subtitle: {
        fontFamily: 'Roboto',
        fontSize: 27,
        color: '#373B45',
    },
    mainItem: {
        width: screenWidth * 0.85,
        height: screenHeight * 0.08,
        borderRadius: 30,
        flexDirection: 'row',
        paddingLeft: 20,
        alignItems: 'center',
        backgroundColor: '#fafafa',
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    mainItemText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        marginLeft: 20,
        color: '#373B45'
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
    }
})