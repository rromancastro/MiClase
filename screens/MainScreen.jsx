import { StyleSheet, Text, View } from "react-native";
import { useUser } from "../contexts/UserContext";
import { EstudianteMain, ProfesorMain } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainScreen(){

    const { userData } = useUser();
    
    return(
        <SafeAreaView style={styles.container}>
            {
                userData.rol == "profesor" ? <ProfesorMain /> : <EstudianteMain />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FBFBFB',
        flex: 1,
        padding: 30,
        paddingBottom: 0,
        gap: 10
    }
})