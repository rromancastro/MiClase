import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const screenWidth = Dimensions.get('window').width;


export const MensajeComponent = ({ msjData, aulaId }) => {

    const [showEliminar, setShowEliminar] = useState(false)

    const { userData } = useUser();
    
    const msjId = msjData.senderId;

    // prevencion si timestamp no esta disponible
    let horas = "";
    let minutos = "";

    if (msjData.timestamp && typeof msjData.timestamp.toDate === "function") {
        const date = msjData.timestamp.toDate();
        horas = date.getHours().toString().padStart(2, '0');
        minutos = date.getMinutes().toString().padStart(2, '0');
    }

    const handleEliminarMensaje = async () => {
        try {
            const mensajeRef = doc(db, "aulas", aulaId, "chat", msjData.id);
            await deleteDoc(mensajeRef);
            console.log("Mensaje eliminado");
        } catch (error) {
            console.error("Error al eliminar el mensaje:", error);
        }
    }

    return (
        <>
            {msjId === userData.id ?
                <TouchableOpacity onLongPress={() => setShowEliminar(!showEliminar)} style={styles.miMensaje}>
                    {showEliminar ? <TouchableOpacity onPress={handleEliminarMensaje}>
                        <AntDesign name="closecircle" size={20} color="#BD222C" style={{marginTop: 10}}/>
                    </TouchableOpacity> : null}
                    <View>
                        <Text style={styles.miMensajeTexto}>{msjData.texto}</Text>
                        <Text style={styles.miMensajeHora}>{horas}:{minutos}</Text>
                    </View>
                    <View style={{width: 40, height: 40, backgroundColor: '#E2E5E9', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={userData.avatarRequired} style={{width: 30, height: 30, borderRadius: 20,}}/>
                    </View>
                </TouchableOpacity>
                :
                <TouchableOpacity onLongPress={() => setShowEliminar(!showEliminar)} style={styles.otroMensaje}>
                    <View style={{width: 40, height: 40, backgroundColor: '#E2E5E9', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={msjData.avatarRequire} style={{width: 30, height: 30, borderRadius: 20,}}/>
                    </View>
                    <View>
                        <Text style={styles.otroMensajeNombre}>{msjData.senderName}</Text>
                        <Text style={styles.otroMensajeTexto}>{msjData.texto}</Text>
                        <Text style={styles.otroMensajeHora}>{horas}:{minutos}</Text>
                    </View>
                    {showEliminar && userData.rol == 'profesor' ? <TouchableOpacity onPress={handleEliminarMensaje}>
                        <AntDesign name="closecircle" size={20} color="#BD222C" style={{marginTop: 20}}/>
                    </TouchableOpacity> : null}
                </TouchableOpacity>
            }
        </>
    );
};

const styles = StyleSheet.create({
    miMensaje: {
        alignSelf: 'flex-end',
        marginTop: 5,
        flexDirection: 'row',
        gap: 10,
    },
    otroMensaje: {
        alignSelf: 'flex-start',
        marginTop: 5,
        flexDirection: 'row',
        gap: 10,
    },
    miMensajeTexto: {
        backgroundColor: '#4A86DF',
        padding: 10,
        borderRadius: 10,
        minWidth: screenWidth * 0.1,
        maxWidth: screenWidth * 0.7,
        marginBottom: 5,
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#fafafa',
    },
    miMensajeHora: {
        fontFamily: 'Roboto',
        textAlign: 'right',
        fontSize: 12,
        color: '#7F8488',
        marginLeft: 10
    },
    otroMensajeNombre: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#363838',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    otroMensajeTexto: {
        backgroundColor: '#E2E5E9',
        padding: 10,
        borderRadius: 10,
        minWidth: screenWidth * 0.1,
        maxWidth: screenWidth * 0.7,
        marginBottom: 5,
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#080807',
    },
    otroMensajeHora: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#A9A9A9',
        marginRight: 10,
        textAlign: 'right',
    }
})