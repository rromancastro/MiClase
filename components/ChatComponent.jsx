import { MensajeComponent } from "./MensajeComponent";
import { useUser } from "../contexts/UserContext";
import { Loader } from "./Loader";

import { useEffect, useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native";

import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const ChatComponent = ({aulaId}) => {
    const navigation = useNavigation();

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
                tipo: 'mensaje',
                avatarUrl: userData.avatarUrl
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


    return (<SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{...styles.container}}>
                {mensajes.length == 0 ? <Loader /> :<ScrollView ref={scrollViewRef} style={styles.mensajesContainer}>
                    {
                        mensajes.map((msg) => {
                            return <MensajeComponent key={msg.id} msjData={msg} aulaId={aulaId}/>
                        })
                    }
                </ScrollView>}
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
                        <FontAwesome name="send" size={20} color="#7F8488" style={styles.sendMensajeButton}/>
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
            </SafeAreaView>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    mensajesContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
    },
    sendMensajeContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        borderTopColor: '#EFEEE7',
        borderTopWidth: 1,
        gap: 10
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
        outlineStyle: 'none'
    },
    sendMensajeButton: {
        backgroundColor: '#E3E5E8',
        padding: 10,
        borderRadius: 10,
    }
})