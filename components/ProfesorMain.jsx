import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CardAula } from "./CardAula";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import getAulaById from "../firebase/getAulaByIds";

const screenWidth = Dimensions.get('window').width;

export const ProfesorMain = () => {

    const navigation = useNavigation();

    const {userData} = useUser();
    console.log(userData)

    //logica drop
    const [dropState, setDropState] = useState("closed");
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(widthAnim, {
        toValue: dropState === "open" ? 240 : 0,
        duration: 300,
        useNativeDriver: false,
        }).start();
    }, [dropState]);

    //logica aulas
    const [userAulasIds, setUserAulasIds] = useState([])
    useEffect(() => setUserAulasIds(userData.aulas),[])

    const [aulas, setAulas] = useState([]);

    useEffect(() => {
    const cargarAulas = async () => {
        const promesas = userAulasIds.map(async (id) => {
        const data = await getAulaById(id);
        return { id, ...data };
        });

        const resultados = await Promise.all(promesas);
        setAulas(resultados);
    };

    cargarAulas();
    }, [userAulasIds]);

    return (<View style={styles.container}>
        <Text style={styles.subTitle}>Tus aulas:</Text>
        <View style={styles.aulasContainer}>
            {aulas.map((aula) => (
                <CardAula
                key={aula.id}
                nombre={aula.nombre}
                icono={aula.icono}
                color={aula.color}
                apellidoProfesor={aula.apellidoProfesor}
                />
            ))}
        </View>
        <Animated.View style={[styles.dropStateBase, { width: widthAnim }]}>
            <TouchableOpacity onPress={() => navigation.replace('CreateAulas')}><Text style={styles.dropText} numberOfLines={1} ellipsizeMode="tail">Crear Aula</Text></TouchableOpacity>
        </Animated.View>
        <View style={styles.utilityes}>
            <TouchableOpacity onPress={() =>setDropState((prev) => (prev === 'closed' ? 'open' : 'closed'))} style={styles.dropButton}><Ionicons name="add" size={44} color="#fafafa" /></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace("EditAccount")} style={styles.userButton}><FontAwesome6 name="user" size={35} color="white"/></TouchableOpacity>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10
    },
    subTitle: {
        fontSize: 26,
        fontFamily: 'Roboto',
        fontWeight: 400
    },
    aulasContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    utilityes: {
        bottom: 0,
        position: 'absolute',
        width: screenWidth - 60
    },
    userButton: {
        width: 70,
        height: 70,
        backgroundColor: '#45799D' ,
        borderRadius: 35,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropButton: {
        width: 70,
        height: 70,
        backgroundColor: '#45799D' ,
        borderRadius: 35,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0
    },
    dropStateBase: {
        position: 'absolute',
        bottom: 0,
        right: 25,
        height: 70,
        backgroundColor: '#45799D',
        borderRadius: 15,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center'
    },
    dropText: {
        color: '#fafafa',
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 600,
        marginLeft: 20,
    }
})