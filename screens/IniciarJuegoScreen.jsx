import { Dimensions, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { CrearImpostor, CrearPalabraFaltante, CrearTrivia, CrearVerdaderoFalso  } from "../juegosComponents";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function IniciarJuegoScreen() {
    
    const route = useRoute();
    const {aulaId} = route.params;

    const navigation = useNavigation();

    const [section, setSection] = useState('seleccionar')
    const [titulo, setTitulo] = useState('Seleccionar juego')

    useEffect(() => {
        section == 'seleccionar' ? setTitulo('Seleccionar juego') : null
        section == 'palabraFaltante' ? setTitulo('Palabra faltante') : null
        section == 'trivia' ? setTitulo('Trivia') : null
        section == 'parejas' ? setTitulo('Parejas') : null
        section == 'verdaderoFalso' ? setTitulo('Verdadero o falso') : null
        section == 'caminoDelSaber' ? setTitulo('Camino del saber') : null
        section == 'impostor' ? setTitulo('Impostor') : null
    }, [section])
    
    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>{titulo}</Text>
            
            {

            section == 'seleccionar' ? <View style={styles.juegosContainer}>

                <TouchableOpacity onPress={() => setSection('palabraFaltante')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/1.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Palabra faltante</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSection('trivia')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/2.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Trivia</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSection('verdaderoFalso')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/4.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Verdadero o falso</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSection('impostor')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/6.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Impostor</Text>
                </TouchableOpacity>

            </View> : 

            section == 'verdaderoFalso' ? <CrearVerdaderoFalso aulaId={aulaId}/> : 
            section == 'trivia' ? <CrearTrivia aulaId={aulaId}/> : 
            section == 'impostor' ? <CrearImpostor aulaId={aulaId}/> :
            section == 'palabraFaltante' ? <CrearPalabraFaltante aulaId={aulaId}/> : null

            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        backgroundColor: '#F6F6F5',
        padding: 30
    },
    subtitle: {
        fontFamily: 'Roboto',
        fontSize: 27,
        color: '#373B45',
        marginBottom: 20,
        marginTop: 50
    },
    title: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: '600',
        color: '#272625',
    },
    juegosContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    juegoCard: {
        width: screenWidth * 0.4,
        height: screenHeight * 0.25,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#Fafafa',
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    juegosImage: {
        width: 110,
        height: 100,
        objectFit: 'contain',
    },
    juegosText: {
        fontFamily: 'Roboto',
        fontSize: 20,
        color: '#363838',
        textAlign: 'center',
    },
})