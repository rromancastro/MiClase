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
    },
    otroMensaje: {
        alignSelf: 'flex-start',
    },
    miMensajeTexto: {
        backgroundColor: '#E2E1D9',
        padding: 10,
        borderRadius: 10,
        maxWidth: screenWidth * 0.7,
        marginBottom: 5,
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#363838',
    },
    miMensajeHora: {
        fontFamily: 'Roboto',
        textAlign: 'right',
        fontSize: 12,
        color: '#A9A9A9',
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
        backgroundColor: '#EFEEE7',
        padding: 10,
        borderRadius: 10,
        maxWidth: screenWidth * 0.7,
        marginBottom: 5,
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#363838',
    },
    otroMensajeHora: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#A9A9A9',
        marginRight: 10,
        textAlign: 'right',
    }
})