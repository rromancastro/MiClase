import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { BarraDeTiempo, Loader } from "../components";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const VerdaderoFalsoJuego = ({juegoId}) => {

    const [juegoData, setJuegoData] = useState(null);
    const [loading, setLoading] = useState(true);

    //escuchar datos en tiempo real
    const docRef = doc(db, "juegos", juegoId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
        setJuegoData(docSnap.data());
        setLoading(false)
    } else {
        console.log("El documento no existe.");
    }
    });

    //iniciar juego
    const handleIniciarJuego = async () => {
        await updateDoc(docRef, {
            activo: true
        });

        let pregunta = juegoData.preguntaActual; // copia local del valor actual

        setInterval(() => {
            pregunta++; // incrementamos la copia local
            updateDoc(docRef, {
                preguntaActual: pregunta
            });
            setRespuesta(null)
        }, 10000);
    }


    //seleccion de respuesta

    const [borderColorVerdadero, setBorderColorVerdadero] = useState('#30B38F')
    const [borderColorFalso, setBorderColorFalso] = useState('#F04A4F')


    const [respuesta, setRespuesta] = useState(null);

    useEffect(() => {
        respuesta == true ? setBorderColorVerdadero('#fafafa') : setBorderColorVerdadero('#30B38F')
        respuesta == false ? setBorderColorFalso('#fafafa') : setBorderColorFalso('#F04A4F')
    }, [respuesta])
    




    return (<View style={styles.container}>
        {
            loading ? <Loader /> :

            !juegoData.activo ? <View style={styles.container}>
                <Image source={require('../assets/iconsgames/4.png')} style={styles.image} />
                <Text style={styles.text}>Verdadero o falso</Text>
                <TouchableOpacity onPress={handleIniciarJuego}><Text style={styles.buttonIniciar}>Iniciar juego</Text></TouchableOpacity>
            </View> : 

            //juego iniciado
            <View style={styles.container}>
                <Image source={require('../assets/iconsgames/4.png')} style={styles.image} />
                <Text style={styles.text}>Verdadero o falso</Text>
                {
                    juegoData.preguntaActual == 0 ? <Text style={styles.text}>¿Estan preparados?</Text> : 

                    <View style={styles.preguntaContainer}>
                        <BarraDeTiempo key={juegoData.preguntaActual} duracion={10} onTerminar={() => console.log('siguiente pregunta')} />
                        <Text style={styles.preguntaText}>{juegoData.preguntas[juegoData.preguntaActual - 1].pregunta}</Text>
                        <TouchableOpacity onPress={() => setRespuesta(true)}><Text style={{...styles.buttonRespuesta, backgroundColor: '#30B38F', borderColor: borderColorVerdadero}}>Verdadero</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setRespuesta(false)}><Text style={{...styles.buttonRespuesta, backgroundColor: '#F04A4F', borderColor: borderColorFalso}}>Falso</Text></TouchableOpacity>
                    </View>
                }
            </View>
        }
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FC9720',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 180,
        height: 110,
    },
    text: {
        fontFamily: 'Roboto',
        fontSize: 26,
        color: '#fafafa',
        fontWeight: '700'
    },
    buttonIniciar: {
        width: screenWidth * 0.6,
        padding: 20,
        backgroundColor: '#3681D1',
        borderRadius: 20,
        fontFamily: 'Roboto',
        color: '#fafafa',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 20
    },
    preguntaText: {
        width: screenWidth * 0.8,
        fontFamily: 'Roboto',
        fontSize: 24,
        color: '#fafafa',
        fontWeight: '600',
        textAlign: 'center',
        backgroundColor: '#DD750C',
        padding: 20,
        borderRadius: 20,
        marginVertical: 10
    },
    buttonRespuesta: {
        width: screenWidth * 0.8,
        padding: 20,
        textAlign: 'center',
        fontFamily: 'Roboto',
        color: '#fafafa',
        fontSize: 24,
        fontWeight: '600',
        marginTop: 20,
        borderRadius: 20,
        borderWidth: 8
    }
})