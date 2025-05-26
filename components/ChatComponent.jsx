import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { db } from "../firebase/firebaseConfig";
import { MensajeComponent } from "./MensajeComponent";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useUser } from "../contexts/UserContext";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const ChatComponent = ({aulaId}) => {

    const [mensaje, setMensaje] = useState("");

    const {userData} = useUser();

    //logica chat

    const [mensajes, setMensajes] = useState([]);

    useEffect(() => {
        const chatRef = collection(db, "aulas", aulaId, "chat");
        const q = query(chatRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const mensajesFirestore = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setMensajes(mensajesFirestore);
        });

        return () => unsubscribe();
    }, [aulaId]);

    //logica enviar mensaje

    const handleSendMensaje = async () => {
        const textoLimpio = mensaje.trim();
        if (textoLimpio === "") return;

        try {
            setMensaje("");
            await addDoc(collection(db, "aulas", aulaId, "chat"), {
                senderName: `${userData.nombre} ${userData.apellido}`,
                senderId: userData.id,
                texto: textoLimpio,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };

    //scroll al final de los mensajes

    const scrollViewRef = useRef();

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [mensajes]);


    return (<View style={styles.container}>
        <View style={styles.nav}>
            <Text style={styles.navText}>Chat grupal</Text>
        </View>
        <ScrollView ref={scrollViewRef} style={styles.mensajesContainer}>
            {
                mensajes.map((msg) => {
                    return <MensajeComponent key={msg.id} msjData={msg} />
                })
            }
        </ScrollView>
        <View style={styles.sendMensajeContainer}>
            <TextInput style={styles.sendMensajeInput}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#A9A9A9"
                onChangeText={setMensaje}
                autoCapitalize="none"
                autoCorrect={false}
                value={mensaje}
            />
            <TouchableOpacity onPress={handleSendMensaje}>
                <FontAwesome name="send" size={20} color="#C7BDB0" style={styles.sendMensajeButton}/>
            </TouchableOpacity>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    nav: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: screenHeight * 0.07,
        borderWidth: 1,
        borderColor: '#E2E1D9'
    },
    navText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: '#363838'
    },
    mensajesContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
        gap: 10
    },
    sendMensajeContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
    },
    sendMensajeInput: {
        width: screenWidth * 0.8,
        borderColor: '#EFEEE7',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#363838',
        marginRight: 10,
        outlineStyle: 'none'
    },
    sendMensajeButton: {
        backgroundColor: '#E2E1D9',
        padding: 10,
        borderRadius: 10,
    }
})