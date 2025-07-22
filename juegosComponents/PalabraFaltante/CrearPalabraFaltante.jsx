import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react"
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { db } from "../../firebase/firebaseConfig";
import { useUser } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const CrearPalabraFaltante = ({aulaId}) => {

    const navigation = useNavigation();

    const {userData} = useUser();

    const [pregunta, setPregunta] = useState({
        pregunta: '',
        respuesta1: '',
        respuesta2: '',
        respuesta3: '',
        respuesta4: '',
        respuestaCorrecta: null
    })

    const [preguntas, setPreguntas] = useState([])

    //logica agregar preguntas al array

    const handleAgregarPregunta = async () => {
        if (pregunta.pregunta.length <= 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error al agregar pregunta',
                    text2: 'La pregunta no puede estar vacía',
                });
        } else {
            if (pregunta.respuesta1.length <= 0 || pregunta.respuesta2.length <= 0 || pregunta.respuesta3.length <= 0 || pregunta.respuesta4.length <= 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error al agregar pregunta',
                    text2: 'Asegurate de rellenar todas las posibles respuestas',
                    });
            } else {
                if (pregunta.respuestaCorrecta == null) {
                    Toast.show({
                    type: 'error',
                    text1: 'Error al agregar pregunta',
                    text2: 'Asegurate de seleccionar la respuesta incorrecta',
                    });
                } else {
                    setPreguntas([...preguntas, pregunta])
                    setPregunta({pregunta: '', respuestaCorrecta: null, respuesta1: '', respuesta2: '', respuesta3: '', respuesta4: ''})
                }
            }
        }
    }

    const handleSubirJuego = async () => {
        try {
            const docRef = await addDoc(collection(db, "juegos"), {
                tipo: 'impostor',
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
                texto: `🎮¡El/La profesor/a ${userData.nombre} ha iniciado un juego de Impostor❌🥷!🧠`,
                timestamp: serverTimestamp(),
                juegoId: docRef.id,
            });


            navigation.navigate("Juego", {juegoId: docRef.id})
        } catch (e) {
            console.error("Error al añadir documento: ", e);
        }
    }

    

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Image source={require('../../assets/iconsgames/1.png')} style={styles.image} />
                <Text style={{fontFamily: 'Roboto', fontSize: 14, alignSelf: 'flex-start'}}>Remplaza la palabra faltante con _______</Text>
                <TextInput style={styles.input} placeholder="Texto" onChangeText={(text) => setPregunta({...pregunta, pregunta: text})} value={pregunta.pregunta} />
                <TextInput style={styles.input} placeholder="Posible Respuesta 1" onChangeText={(text) => setPregunta({...pregunta, respuesta1: text})} value={pregunta.respuesta1} />
                <TextInput style={styles.input} placeholder="Posible Respuesta 2" onChangeText={(text) => setPregunta({...pregunta, respuesta2: text})} value={pregunta.respuesta2} />
                <TextInput style={styles.input} placeholder="Posible Respuesta 3" onChangeText={(text) => setPregunta({...pregunta, respuesta3: text})} value={pregunta.respuesta3} />
                <TextInput style={styles.input} placeholder="Posible Respuesta 4" onChangeText={(text) => setPregunta({...pregunta, respuesta4: text})} value={pregunta.respuesta4} />
                <Text style={{fontFamily: 'Roboto', fontSize: 16, color: '#272625'}}>Palabra correcta:</Text>
                <View style={{flexDirection: 'row', gap: 20, marginVertical: 10}}>
                    <TouchableOpacity onPress={()=>setPregunta({...pregunta, respuestaCorrecta: 1})}><Text style={{...styles.buttonCorrecta, backgroundColor: pregunta.respuestaCorrecta === 1 ? '#2EB38D' : '#EF494D',boxShadow: '3px 3px 0px #DBDCDC'}}>1</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setPregunta({...pregunta, respuestaCorrecta: 2})}><Text style={{...styles.buttonCorrecta, backgroundColor: pregunta.respuestaCorrecta === 2 ? '#2EB38D' : '#EF494D',boxShadow: '3px 3px 0px #DBDCDC'}}>2</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setPregunta({...pregunta, respuestaCorrecta: 3})}><Text style={{...styles.buttonCorrecta, backgroundColor: pregunta.respuestaCorrecta === 3 ? '#2EB38D' : '#EF494D',boxShadow: '3px 3px 0px #DBDCDC'}}>3</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setPregunta({...pregunta, respuestaCorrecta: 4})}><Text style={{...styles.buttonCorrecta, backgroundColor: pregunta.respuestaCorrecta === 4 ? '#2EB38D' : '#EF494D',boxShadow: '3px 3px 0px #DBDCDC'}}>4</Text></TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleAgregarPregunta}><Text style={styles.agregarButton}>Añadir pregunta</Text></TouchableOpacity>
                {
                    preguntas.map((pregunta, index) => {
                        return <View key={index} style={styles.itemList}>
                            <Text style={styles.itemListPregunta}>{`${index + 1}) ${pregunta.pregunta}`}</Text>
                            <View style={{flexDirection: 'row', gap: 20, flexWrap: 'wrap'}}>
                                <Text style={{...styles.itemListRespuesta, backgroundColor: pregunta.respuestaCorrecta === 1 ? '#EF494D' : '#2EB38D'}}>{pregunta.respuesta1}</Text>
                                <Text style={{...styles.itemListRespuesta, backgroundColor: pregunta.respuestaCorrecta === 2 ? '#EF494D' : '#2EB38D'}}>{pregunta.respuesta2}</Text>
                                <Text style={{...styles.itemListRespuesta, backgroundColor: pregunta.respuestaCorrecta === 3 ? '#EF494D' : '#2EB38D'}}>{pregunta.respuesta3}</Text>  
                                <Text style={{...styles.itemListRespuesta, backgroundColor: pregunta.respuestaCorrecta === 4 ? '#EF494D' : '#2EB38D'}}>{pregunta.respuesta4}</Text>
                            </View>
                        </View>
                    })
                }
                {preguntas.length > 0 ? <TouchableOpacity onPress={handleSubirJuego}><Text style={styles.iniciarButton}>Iniciar juego (Tus alumnos podrán unirse desde el chat grupal)</Text></TouchableOpacity> : null}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 5
    },
    image: {
        width: 220,
        height: 110,
        marginBottom: 20,
        objectFit: 'contain'
    },
    input: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: '#272625',
        outlineStyle: 'none',
        width: screenWidth * 0.85,
        height: screenHeight * 0.08,
        borderRadius: 30,
        paddingLeft: 20,
        backgroundColor: '#Fafafa',
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    buttonCorrecta: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: screenWidth * 0.1,
        textAlign: 'center',
        fontFamily: 'Roboto',
        color: '#fafafa',
        fontSize: 18,
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
        backgroundColor: '#3580CF',
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    itemList: {
        width: screenWidth * 0.85,
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        display: 'flex',
        gap: 20,
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    itemListPregunta: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: '#272625',
    },
    itemListRespuesta: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: '#fafafa',
        fontWeight: '600',
        width: screenWidth * 0.3,
        paddingVertical: 7,
        borderRadius: 10,
        textAlign: 'center'
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
        backgroundColor: '#FDC63E',
        marginBottom: 20,
        boxShadow: '3px 3px 0px #DBDCDC'
    },
})