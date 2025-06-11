import { Dimensions, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { VerdaderoFalso } from "./CrearJuego";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const IniciarJuego = ({aulaId}) => {

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
            <View style={styles.nav}>
                <TouchableOpacity onPress={() => navigation.replace("Aula", {aulaId: aulaId})}><AntDesign name="arrowleft" size={34} color='#363838' style={styles.navBack} /></TouchableOpacity>
                <Text style={styles.navText}>Iniciar juego</Text>
            </View>
            <Text style={styles.title}>{titulo}</Text>
            
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

                <TouchableOpacity onPress={() => setSection('parejas')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/3.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Parejas</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSection('verdaderoFalso')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/4.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Verdadero o falso</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSection('caminoDelSaber')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/5.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Camino del saber</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSection('impostor')} style={{...styles.juegoCard}}>
                    <Image source={require('../assets/iconsgames/6.png')} style={styles.juegosImage} />
                    <Text style={styles.juegosText}>Impostor</Text>
                </TouchableOpacity>

            </View> : 

            section == 'verdaderoFalso' ? <VerdaderoFalso aulaId={aulaId}/> : null

            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        gap: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: '600',
        color: '#272625',
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
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    juegosImage: {
        width: 150,
        height: 140,
    },
    juegosText: {
        fontFamily: 'Roboto',
        fontSize: 20,
        color: '#363838',
        fontWeight: '700'
    },
})