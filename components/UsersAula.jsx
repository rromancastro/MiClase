import { Dimensions, StyleSheet, Text, View } from "react-native"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const UsersAula = () => {
    return (<View style={styles.container}>
        <View style={styles.nav}>
            <Text style={styles.navText}>Participantes</Text>
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
})