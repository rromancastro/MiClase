import { arrayUnion, collection, doc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useRef, useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { BarraDeTiempo, CachedSvg, Loader } from "../../components";
import { Dimensions } from "react-native";
import { useUser } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const VerdaderoFalsoJuego = ({juegoId}) => {

  const navigation = useNavigation();

  const [juegoData, setJuegoData] = useState({preguntaActual: 0});
  const [totalPreguntas, setTotalPreguntas] = useState(0);
  const [participantes, setParticipantes] = useState([]);
  const [topFive, setTopFive] = useState([]);
  const [puntosTotales, setPuntosTotales] = useState(0);
  const puntosTotalesRef = useRef(0);

  const [loading, setLoading] = useState(true);
  const { userData } = useUser();

  const [buttonDisableds, setButtonDisableds] = useState(false);
  const [borderColorVerdadero, setBorderColorVerdadero] = useState('#30B38F');
  const [borderColorFalso, setBorderColorFalso] = useState('#F04A4F');
  const [respuesta, setRespuesta] = useState(null);
  const [showUnirse, setShowUnirse] = useState(true);

  const docRef = doc(db, 'juegos', juegoId);
  const participantesRef = collection(db, 'juegos', juegoId, 'participantes');

  //reactivar botones 
  useEffect(()=> {
      setRespuesta(null);
      setButtonDisableds(false);
  }, [juegoData.preguntaActual])

  // escuchar cambios del juego
  useEffect(() => {
    const unsubJuego = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setJuegoData(docSnap.data());
        setLoading(false);
        setTotalPreguntas(docSnap.data().preguntas.length);
      }
    });

    const unsubParticipantes = onSnapshot(participantesRef, (snapshot) => {
      const participantes = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      setParticipantes(participantes);
      setTopFive(participantes.sort((a, b) => b.puntos - a.puntos).slice(0, 5));
    });

    return () => {
      unsubJuego();
      unsubParticipantes();
    };
  }, []);

  // unirse al juego
  const handleUnirse = async () => {
    try {
      const participanteRef = doc(db, 'juegos', juegoId, 'participantes', userData.id);
      await setDoc(participanteRef, {
        nombre: userData.nombre,
        avatarRequired: userData.avatarUrl,
        puntos: 0,
      });
      setShowUnirse(false);
    } catch (error) {
      console.error("Error al unirse:", error);
    }
  };

  // iniciar el juego
  const handleIniciarJuego = async () => {
  await updateDoc(docRef, {
    activo: true,
    preguntaActual: 0,
    timestampInicioPregunta: Date.now()
  });

  let pregunta = 0;

  const intervalo = setInterval(async () => {
    pregunta++;

    if (pregunta >= totalPreguntas + 2) {
      clearInterval(intervalo);
      return;
    }

    await updateDoc(docRef, {
      preguntaActual: pregunta,
      timestampInicioPregunta: Date.now()
    });

    setRespuesta(null);
    setButtonDisableds(false);
  }, 10000);
};

  // lgica para cambiar bordes buttons
  useEffect(() => {
    setBorderColorVerdadero(respuesta === true ? '#fafafa' : '#30B38F');
    setBorderColorFalso(respuesta === false ? '#fafafa' : '#F04A4F');
  }, [respuesta]);

  // calcular puntos
  const calcularPuntos = () => {
  if (!juegoData?.timestampInicioPregunta) return 0;

  const tiempoMs = Date.now() - juegoData.timestampInicioPregunta;
  const segundos = tiempoMs / 1000; 
  const puntos = Math.max(0, 960 - 36 * segundos);

  return Math.round(puntos);
};

  // ✔️ Seleccionar respuesta
  const handleRespuesta = async (respuestaSeleccionada) => {
    console.log("cooroeorosodaow");
    
    setRespuesta(respuestaSeleccionada);
    setButtonDisableds(true);

    const participanteRef = doc(db, 'juegos', juegoId, 'participantes', userData.id);
    const respuestaCorrecta = juegoData?.preguntas?.[juegoData.preguntaActual - 1]?.respuesta;

    if (respuestaSeleccionada === respuestaCorrecta) {
      const puntosGanados = calcularPuntos();
      await updateDoc(participanteRef, {
        puntos: increment(puntosGanados)
      });

      setPuntosTotales((prev) => {
        const nuevoTotal = prev + puntosGanados;
        puntosTotalesRef.current = nuevoTotal;
        return nuevoTotal;
      });

      console.log("Respuesta correcta. Puntos ganados:", puntosGanados);
    } else {
      console.log("Respuesta incorrecta.");
    }
  };

    return (<SafeAreaView style={styles.container}>
        {
            loading ? <Loader /> :

            !juegoData.activo ? <View style={styles.container}>
                <Image source={require('../../assets/iconsgames/4.png')} style={styles.image} />
                <Text style={styles.text}>Verdadero o falso</Text>
                <Text style={{...styles.text, fontSize: 16, width: screenWidth * .8, textAlign: 'center'}}>Mientras mas rapido respondas, más puntos ganarás!</Text>
                {userData.rol === 'profesor' ? <TouchableOpacity onPress={handleIniciarJuego}><Text style={styles.buttonIniciar}>Iniciar juego</Text></TouchableOpacity> : null}
                {userData.rol === 'estudiante' ? showUnirse ? <TouchableOpacity onPress={handleUnirse}><Text style={styles.buttonIniciar}>Unirme</Text></TouchableOpacity> : null : null}
                <View style={styles.participantes}>
                    {
                        participantes.map((participante, index) => {
                            return <View key={index} style={styles.participanteContainer} >
                                <CachedSvg width="60" height="60" uri={participante.avatarRequired} />
                                <Text style={{fontFamily: 'Roboto', fontSize: 16, color: '#fafafa', fontWeight: 700}}>{participante.nombre}</Text>
                            </View>
                        })
                    }
                </View>
            </View> : 

            //juego iniciado
            <View style={styles.container}>
                {
                  //preparados
                    juegoData.preguntaActual == 0 ? <Text style={styles.text}>¿Estan preparados?</Text> : 
                    
                    //juego en curso
                    juegoData.preguntaActual <= juegoData.preguntas.length ? <View style={{alignItems: 'center', justifyContent: 'center'}}>

                    <View style={styles.preguntaContainer}>
                        <Image source={require('../../assets/iconsgames/4.png')} style={styles.image} />
                        <Text style={styles.text}>Verdadero o falso</Text>
                        <BarraDeTiempo key={juegoData.preguntaActual} backgroundColor={"#DD750C"} duracion={10} onTerminar={() => console.log('siguiente pregunta')} />
                        <Text style={styles.preguntaText}>{juegoData.preguntas[juegoData.preguntaActual - 1].pregunta}</Text>
                        <TouchableOpacity disabled={buttonDisableds}onPress={() => handleRespuesta(true)}><Text style={{...styles.buttonRespuesta, backgroundColor: '#30B38F', borderColor: respuesta === true ? '#fafafa' : '#269C7C'}}>{buttonDisableds ? juegoData?.preguntas?.[juegoData.preguntaActual - 1]?.respuesta === true ? <AntDesign name="checkcircle" size={24} color="#fafafa" style={{marginRight: 10}}/> : <Entypo name="circle-with-cross" size={24} color="#fafafa" style={{marginRight: 10}}/> : null}Verdadero</Text></TouchableOpacity>
                        <TouchableOpacity disabled={buttonDisableds}onPress={() => handleRespuesta(false)}><Text style={{...styles.buttonRespuesta, backgroundColor: '#F04A4F', borderColor: respuesta === false ? '#fafafa' : '#CE3D42'}}>{buttonDisableds ? juegoData?.preguntas?.[juegoData.preguntaActual - 1]?.respuesta === false ? <AntDesign name="checkcircle" size={24} color="#fafafa" style={{marginRight: 10}}/> : <Entypo name="circle-with-cross" size={24} color="#fafafa" style={{marginRight: 10}}/> : null}Falso</Text></TouchableOpacity>
                    </View>
                    
                    <View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginVertical: 20}}>
                            <CachedSvg width="50" height="50" uri={userData.avatarUrl} />
                            <Text style={{fontFamily: 'Roboto', fontSize: 16, color: '#fafafa', fontWeight: 700}}>Mis puntos: {puntosTotales}</Text>
                        </View>
                        <View style={styles.topTresContainer}>
                            {topFive[1] ? <View style={{alignItems: 'center',}}>
                                <CachedSvg width="50" height="50" uri={topFive[1].avatarRequired} />
                                <Text style={{fontFamily: 'Roboto', marginBottom: 5,fontSize: 18, color: '#fafafa', fontWeight: 700}}>{topFive[1].nombre}</Text>
                                <Text style={{fontFamily: 'Roboto', marginBottom: 10,fontSize: 16, color: '#fafafa', fontWeight: 700, backgroundColor: '#DD750C', borderRadius: 7, padding: 7}}>{topFive[1].puntos} Puntos</Text>
                                <View style={{backgroundColor:'rgb(233, 126, 20)', height: 20, width: screenWidth * .26, borderTopLeftRadius: 20}} />
                                <View style={{backgroundColor:'#DD750C', width: screenWidth * .26, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text style={{fontSize: 80, fontFamily: 'Roboto', fontWeight: 700, color: '#fafafa', marginBottom: 10}}>2</Text>
                                </View>
                            </View> : null}
                            <View style={{alignItems: 'center',}}>
                                <CachedSvg width="50" height="50" uri={topFive[0].avatarRequired} />
                                <Text style={{fontFamily: 'Roboto', marginBottom: 5,fontSize: 18, color: '#fafafa', fontWeight: 700}}>{topFive[0].nombre}</Text>
                                <Text style={{fontFamily: 'Roboto', marginBottom: 10,fontSize: 16, color: '#fafafa', fontWeight: 700, backgroundColor: '#DD750C', borderRadius: 7, padding: 7}}>{topFive[0].puntos} Puntos</Text>
                                <View style={{backgroundColor:'rgb(233, 126, 20)', height: 20, width: screenWidth * .26, borderTopLeftRadius: 20, borderTopRightRadius: 20}} />
                                <View style={{backgroundColor:'#DD750C', width: screenWidth * .26, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text style={{fontSize: 90, fontFamily: 'Roboto', fontWeight: 700, color: '#fafafa', marginBottom: 20}}>1</Text>
                                </View>
                            </View>
                            {topFive[2] ? <View style={{alignItems: 'center',}}>
                                <CachedSvg width="50" height="50" uri={topFive[2].avatarRequired} />
                                <Text style={{fontFamily: 'Roboto', marginBottom: 5,fontSize: 18, color: '#fafafa', fontWeight: 700}}>{topFive[2].nombre}</Text>
                                <Text style={{fontFamily: 'Roboto', marginBottom: 10,fontSize: 16, color: '#fafafa', fontWeight: 700, backgroundColor: '#DD750C', borderRadius: 7, padding: 7}}>{topFive[2].puntos} Puntos</Text>
                                <View style={{backgroundColor:'rgb(233, 126, 20)', height: 20, width: screenWidth * .26, borderTopRightRadius: 20}} />
                                <View style={{backgroundColor:'#DD750C', width: screenWidth * .26, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text style={{fontSize: 70, fontFamily: 'Roboto', fontWeight: 700, color: '#fafafa'}}>3</Text>
                                </View>
                            </View> : null}
                        </View>
                    </View>

                    </View> :

                    //juego terminado

                    <View style={styles.container}>
                      <CachedSvg uri={userData.avatarUrl} width={180} height={110} marginBottom={20} />
                      <Text style={{fontFamily: 'Roboto', fontSize: 24, color: '#fafafa', fontWeight: 700}}>¡Felicidades, {userData.nombre}!</Text>
                      <Text style={{fontFamily: 'Roboto', fontSize: 24, color: '#fafafa', fontWeight: 700, marginBottom: 20}}>¡Has ganado {puntosTotales} puntos!</Text>
                      <Text style={{fontFamily: 'Roboto', marginBottom: 10 , fontSize: 24, color: '#fafafa', fontWeight: 700, backgroundColor: '#DD750C', padding: 10, borderRadius: 20, width: screenWidth * .4, textAlign: 'center'}}>Top 5:</Text>
                        {
                          topFive.map((participante, index) => {
                              return topFive[index] ? <View key={index} style={{flexDirection: "row", marginBottom: 10 , gap: 10, alignItems: 'center',backgroundColor: '#DD750C', padding: 15, borderRadius: 20, width: screenWidth * .8}} > 
                              {
                                index === 0 ? <FontAwesome5 name="medal" size={24} color="#F9C932" style={{backgroundColor: 'rgb(255, 255, 255)', padding: 10, borderRadius: 30}}/> :
                                index === 1 ? <FontAwesome5 name="medal" size={24} color="#E0E5EB" style={{backgroundColor: 'rgb(255, 255, 255)', padding: 10, borderRadius: 30}}/> :
                                index === 2 ? <FontAwesome5 name="medal" size={24} color="#CA844E" style={{backgroundColor: 'rgb(255, 255, 255)', padding: 10, borderRadius: 30}}/> :
                                <Text style={{fontFamily: 'Roboto', fontSize: 22, color: '#fafafa', fontWeight: 700, width: 45, textAlign: 'center'}}>{index + 1}</Text> 
                              }
                              <CachedSvg width="50" height="50" uri={participante.avatarRequired} />
                              <Text style={{fontFamily: 'Roboto', fontSize: 22, color: '#fafafa', fontWeight: 700}}>{participante.nombre}</Text>
                              <Text style={{fontFamily: 'Roboto', fontSize: 22, color: '#fafafa', fontWeight: 700, position: 'absolute', right: 30}}>{participante.puntos}</Text>
                            </View> : null
                          })
                        }
                    </View>

                }
            </View>
        }
    </SafeAreaView>)
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
    participantes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
        gap: 10,
    }, 
    participanteContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    preguntaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
        padding: 10,
        textAlign: 'center',
        fontFamily: 'Roboto',
        color: '#fafafa',
        fontSize: 24,
        fontWeight: '600',
        marginTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomWidth: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topFive: {
        gap: 10,
        width: screenWidth * 0.6,
    },
    topTresContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
})