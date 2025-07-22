import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import { useNavigation } from "@react-navigation/native";

import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Svg, { Path, SvgUri } from "react-native-svg";
import { useState } from "react";
import { Loader } from "./Loader";
import { CachedSvg } from "./CachedSvg";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export const CardAula = ({color, icono, nombre, apellidoProfesor, id, avatar}) => {

    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("Aula", {aulaId: id})
    }

    const [loadingImage, setLoadingImage] = useState(true);

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
            <View style={styles.dataProfesor}>
                <View width={40} height={40} justifyContent={'center'} alignItems={'center'}>
                    <CachedSvg uri={avatar} width="40" height="40" />
                </View>
                <View>
                    <Text style={{...styles.apellidoProfesor, fontSize: 12}}>{`Prof.`}</Text>
                    <Text style={{...styles.apellidoProfesor, fontSize: 16}}>{`${apellidoProfesor}`}</Text>
                </View>
            </View>
            <Svg width={90} height={90} style={styles.curva} viewBox=" -30 -80 60 100" >
            <Path
                d="M 0 12 L -0 -72 C -10 -56 -18 -55 -24 -43 C -28 -30 -28 -30 -24 -18 C -18 -6 -10 -6 0 12"
                
                fill="#FBFBFB"
            />
            </Svg>
            <AntDesign name="arrowup" size={20} color={color} style={styles.row} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth * 0.41,
        height: 220,
        borderRadius: 25,
        gap: 10,
        boxShadow: '3px 3px 0px #DBDCDC'
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        marginLeft: 10,
        marginTop: 10,
        backgroundColor:"rgba(250, 250, 250, 0.2)",
        padding: 10
    },
    nombre: {
        color: '#fafafa',
        fontSize: 26,
        fontFamily: 'Roboto',
        fontWeight: '700',
        marginLeft: 10,
        position: 'absolute',
        bottom: 60,
    },
    dataProfesor: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 11,
        left: 8,
        gap: 7,
    },
    apellidoProfesor: {
        color: '#fafafa',
        fontFamily: 'Roboto',
        fontWeight: '500',
    },
    curva: {
        position: 'absolute',
        right: -28,
        bottom: 80,
    },
    row: {
        position: 'absolute',
        right: -3,
        bottom: 113,
        transform: [{ rotate: '30deg' }],
    }
})