import { StyleSheet, Text, View } from "react-native";
import { useUser } from "../contexts/UserContext";
import { EstudianteMain, ProfesorMain } from "../components";

export default function MainScreen(){

    const { userData } = useUser();
    
    return(
        <View style={styles.container}>
            <Text style={styles.titleMain}>{`¡Hola, ${userData.nombre}!`}</Text>
            {
                userData.rol == "profesor" ? <ProfesorMain /> : <EstudianteMain />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F6F0',
        flex: 1,
        padding: 30,
        paddingBottom: 0,
        gap: 10
    },
    titleMain: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: '700'
    }
})