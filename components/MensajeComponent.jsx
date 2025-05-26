import { Dimensions, StyleSheet, Text, View } from "react-native"
import { useUser } from "../contexts/UserContext";

const screenWidth = Dimensions.get('window').width;


export const MensajeComponent = ({ msjData }) => {
    const { userData } = useUser();
    const msjId = msjData.senderId;

    // Prevención si timestamp no está disponible aún
    let horas = "";
    let minutos = "";

    if (msjData.timestamp && typeof msjData.timestamp.toDate === "function") {
        const date = msjData.timestamp.toDate();
        horas = date.getHours().toString().padStart(2, '0');
        minutos = date.getMinutes().toString().padStart(2, '0');
    }

    return (
        <>
            {msjId === userData.id ?
                <View style={styles.miMensaje}>
                    <Text style={styles.miMensajeTexto}>{msjData.texto}</Text>
                    <Text style={styles.miMensajeHora}>{horas}:{minutos}</Text>
                </View>
                :
                <View style={styles.otroMensaje}>
                    <Text style={styles.otroMensajeNombre}>{msjData.senderName}</Text>
                    <Text style={styles.otroMensajeTexto}>{msjData.texto}</Text>
                    <Text style={styles.otroMensajeHora}>{horas}:{minutos}</Text>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    miMensaje: {
        alignSelf: 'flex-end',
        marginTop: 5
    },
    otroMensaje: {
        alignSelf: 'flex-start',
        marginTop: 5
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