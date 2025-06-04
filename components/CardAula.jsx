import { Dimensions, StyleSheet, Text, TouchableOpacity} from "react-native"
import { useNavigation } from "@react-navigation/native";

import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export const CardAula = ({color, icono, nombre, apellidoProfesor, id}) => {

    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("Aula", {aulaId: id})
    }

    return (
        <TouchableOpacity onPress={handlePress} style={{...styles.container, backgroundColor: color}}>
            {
                    icono == 'calculator' ?  <Ionicons style={styles.cardIcon} name="calculator" size={30} color="#fafafa" /> :
                    icono == 'book' ? <Entypo style={styles.cardIcon} name="book" size={30} color="#fafafa" /> :
                    icono == 'world' ? <Fontisto style={styles.cardIcon} name="world" size={30} color="#fafafa" /> :
                    icono == 'computer' ? <MaterialIcons style={styles.cardIcon} name="computer" size={30} color="#fafafa" /> :
                    icono == 'format-letter-case' ? <MaterialCommunityIcons style={styles.cardIcon} name="format-letter-case" size={100} color="#fafafa" /> :
                    icono == 'chemistry' ? <SimpleLineIcons style={styles.cardIcon} name="chemistry" size={30} color="#fafafa" /> :
                    icono == 'language' ? <FontAwesome style={styles.cardIcon} name="language" size={30} color="#fafafa" /> :
                    icono == 'musical-notes' ? <Ionicons style={styles.cardIcon} name="musical-notes" size={30} color="#fafafa" /> :
                    icono == 'sports-handball' ? <MaterialIcons style={styles.cardIcon} name="sports-handball" size={30} color="#fafafa" /> : null
            }
            <Text style={styles.nombre}>{nombre}</Text>
            <Text style={styles.apellidoProfesor}>{`Prof. ${apellidoProfesor}`}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth * 0.85,
        height: screenHeight * 0.08,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10
    },
    cardIcon: {
        width: 30,
        height: 30,
        marginLeft: 20
    },
    nombre: {
        color: '#fafafa',
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: '500',
    },
    apellidoProfesor: {
        color: '#fafafa',
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500'
    }
})