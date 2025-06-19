import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CardAula } from "./CardAula";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import getAulaById from "../firebase/getAulaByIds";
import { CrearAula } from "./CrearAula";
import { EditarPerfil } from "./EditarPerfil";
import { Loader } from "./Loader";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { IngresarAlAula } from "./IngresarAlAula";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const EstudianteMain = () => {

    const navigation = useNavigation();

    const {userData} = useUser();
    console.log(userData)

     //logica hora bienvenida
    const date = new Date();
    const hora = date.getHours();
    console.log(hora);
    

    //logica aulas
    const [userAulasIds, setUserAulasIds] = useState([])
    const [loading, setLoading] = useState(true)

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
        setLoading(false);
    };

    cargarAulas();
    }, [userAulasIds]);

    //logica barra de tareas
    const [section, setSection] = useState('clases');

    const [colorIconClases, setColorIconClases] = useState('')
    const [colorIconCrearAula, setColorIconIngresarAula] = useState('')
    const [colorIconEditarPerfil, setColorIconEditarPerfil] = useState('')

    useEffect(() => {
        setColorIconClases(section == 'clases' ? "#2979F8" : "#C0CBD9")
        setColorIconIngresarAula(section == 'ingresarAula' ? "#2979F8" : "#C0CBD9")
        setColorIconEditarPerfil(section == 'editarPerfil' ? "#2979F8" : "#C0CBD9")
    }, [section])

    return (<>{loading ? <Loader /> : <View style={styles.container}>
        {
            section == 'clases' ? 
                <View style={styles.container}>
                     <Text style={styles.titleMainBienvenida}>{
                            hora < 12 ? 'Buenos días,' :
                            hora < 18 ? 'Buenas tardes,' : 
                            hora < 21 ? 'Buenas noches, ' : null
                         }</Text>
                    <Text style={styles.titleMain}>{`${userData.nombre}! 😁`}</Text>
                    <Text style={styles.subTitle}>Tus aulas:</Text>
                    <View style={styles.aulasContainer}>
                        {aulas.map((aula) => (
                            <CardAula
                                key={aula.id}
                                nombre={aula.nombre}
                                icono={aula.icono}
                                color={aula.color}
                                apellidoProfesor={aula.apellidoProfesor}
                                id={aula.id}
                                avatar={aula.profesorAvatarUrl}
                            />
                        ))}
                    </View>
                </View> : 
            section == 'ingresarAula' ? <IngresarAlAula /> :
            section == 'editarPerfil' ? <EditarPerfil /> : null
        }
        <View style={styles.utilityes}>
            <TouchableOpacity onPress={() => setSection('clases')} style={styles.utilityesButton}>
                <Entypo style={styles.utilityesButtonIcon} name="home" size={34} color={colorIconClases} />
                <Text style={{...styles.utilityesButtonText, color: colorIconClases}}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSection('ingresarAula')} style={styles.utilityesButton}>
                <MaterialCommunityIcons style={styles.utilityesButtonIcon} name="google-classroom" size={34} color={colorIconCrearAula} />
                <Text style={{...styles.utilityesButtonText, color: colorIconCrearAula}}>Ingresar al aula</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSection('editarPerfil')} style={styles.utilityesButton}>
                <FontAwesome5 style={styles.utilityesButtonIcon} name="user-alt" size={34} color={colorIconEditarPerfil} />
                <Text style={{...styles.utilityesButtonText, color: colorIconEditarPerfil}}>Editar usuario</Text>
            </TouchableOpacity>
        </View>
    </View>}</>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10
    },
    titleMainBienvenida: {
        fontSize: 17,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: '#B3B3BD',
        position: 'absolute',
    },
    titleMain: {
        fontSize: 39,
        fontFamily: 'Roboto',
        fontWeight: '700',
        marginTop: 20
    },
    subTitle: {
        fontSize: 26,
        fontFamily: 'Roboto',
        fontWeight: 400
    },
    aulasContainer: {
        flex: 1,
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    utilityes: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        height: screenHeight * .09,
        borderTopColor: '#EFEEE7',
        borderTopWidth: 1
    },
    utilityesButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: screenHeight * .09,
    },
    utilityesButtonIcon: {
        width: 34,
        height: 34
    },
    utilityesButtonText: {
        fontFamily: 'Roboto',
        fontSize: 16
    }
})