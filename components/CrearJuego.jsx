import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react"
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { db } from "../firebase/firebaseConfig";
import { useUser } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const VerdaderoFalso = ({aulaId}) => {

    const navigation = useNavigation();

    const {userData} = useUser();

    const [pregunta, setPregunta] = useState({
        pregunta: '',
        respuesta: null
    })

    const [borderColorVerdadero, setBorderColorVerdadero] = useState('#2EB38D')
    const [borderColorFalso, setBorderColorFalso] = useState('#EF4B4E')

    const [preguntas, setPreguntas] = useState([])

    //logica bordes de respuestas
    useEffect(() => {
        pregunta.respuesta == true ? setBorderColorVerdadero('#E3E8EC') : setBorderColorVerdadero('#2EB38D')
        pregunta.respuesta == false ? setBorderColorFalso('#E3E8EC') : setBorderColorFalso('#EF4B4E')
    }, [pregunta.respuesta])

    //logica agregar preguntas al array

    const handleAgregarPregunta = async () => {
        if (pregunta.pregunta.length > 0 && pregunta.respuesta != null) {
            setPreguntas([...preguntas, pregunta])
            setPregunta({pregunta: '', respuesta: null})
        }
    }

    const handleSubirJuego = async () => {
        try {
            const docRef = await addDoc(collection(db, "juegos"), {
                tipo: 'verdaderoFalso',
                preguntas: preguntas,
                activo: false,
                resultados: [],
                idProfesor: userData.id,
                preguntaActual: 0,
                datosParticipantes: [],
            });

            console.log("Documento escrito con ID: ", docRef.id);

            //enviar invitacion a los alumnos
            const aulaRef = collection(db, "aulas", aulaId, "chat");
            await addDoc(aulaRef, {
                senderName: `${userData.nombre} ${userData.apellido}`,
                senderId: userData.id,
                tipo: 'juego',
                texto: `🎮¡El/La profesor/a ${userData.nombre} ha iniciado un juego de Verdadero o Falso!🧠`,
                timestamp: serverTimestamp(),
                juegoId: docRef.id,
                avatarRequire: require('../assets/avatars/icon.png')
            });


            navigation.navigate("Juego", {juegoId: docRef.id})
        } catch (e) {
            console.error("Error al añadir documento: ", e);
        }
    }

    

    return (
        <View style={styles.container}>
            <Image source={require('../assets/iconsgames/4.png')} style={styles.image} />
            <TextInput style={styles.input} placeholder="Pregunta" onChangeText={(text) => setPregunta({...pregunta, pregunta: text})} value={pregunta.pregunta} />
            <View style={styles.respuestas}>
                <TouchableOpacity onPress={() => setPregunta({...pregunta, respuesta: true})}><Text style={{...styles.respuestaButton, backgroundColor: '#2EB38D', borderColor: borderColorVerdadero}} >Verdadero</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setPregunta({...pregunta, respuesta: false})}><Text style={{...styles.respuestaButton, backgroundColor: '#EF4B4E', borderColor: borderColorFalso}} >Falso</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleAgregarPregunta}><Text style={styles.agregarButton}>Añadir pregunta</Text></TouchableOpacity>
            {
                preguntas.map((pregunta, index) => {
                    return <View key={index} style={styles.itemList}>
                        <Text style={styles.itemListPregunta}>{`${index + 1}) ${pregunta.pregunta}`}</Text>
                        <Text style={styles.itemListRespuesta}>{pregunta.respuesta ? 'Verdadero' : 'Falso'}</Text>
                    </View>
                })
            }
            {preguntas.length > 0 ? <TouchableOpacity onPress={handleSubirJuego}><Text style={styles.iniciarButton}>Iniciar juego (Tus alumnos podrán unirse desde el chat grupal)</Text></TouchableOpacity> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: 220,
        height: 110,
        marginBottom: 20
    },
    input: {
        width: screenWidth * 0.85,
        borderWidth: 1,
        borderColor: '#E3E8EC',
        borderRadius: 20,
        fontFamily: 'Roboto',
        padding: 20,
        fontSize: 18,
        color: '#272625',
        outlineStyle: 'none',
    },
    respuestas: {
        flexDirection: 'row',
        gap: 20,
        margin: 20
    },
    respuestaButton: {
        width: screenWidth * 0.4,
        borderWidth: 1,
        borderColor: '#E3E8EC',
        borderRadius: 20,
        fontFamily: 'Roboto',
        padding: 20,
        fontSize: 18,
        color: '#fafafa',
        textAlign: 'center',
        fontWeight: '600',
        borderWidth: 8
    },
    agregarButton: {
        width: screenWidth * 0.8,
        borderWidth: 1,
        borderColor: '#E3E8EC',
        borderRadius: 20,
        fontFamily: 'Roboto',
        padding: 20,
        fontSize: 18,
        color: '#fafafa',
        textAlign: 'center',
        fontWeight: '600',
        backgroundColor: '#3580CF'
    },
    itemList: {
        width: screenWidth * 0.85,
        borderWidth: 1,
        borderColor: '#E3E8EC',
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 20
    },
    itemListPregunta: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: '#272625',
    },
    itemListRespuesta: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: '#272625',
        fontWeight: '600'
    },
    iniciarButton: {
        width: screenWidth * 0.8,
        borderWidth: 1,
        borderColor: '#E3E8EC',
        borderRadius: 20,
        fontFamily: 'Roboto',
        padding: 20,
        fontSize: 18,
        color: '#15334F',
        textAlign: 'center',
        fontWeight: '600',
        backgroundColor: '#FDC63E'
    },
})