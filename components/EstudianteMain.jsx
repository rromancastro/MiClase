import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
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
import { limpiarNotificaciones, programarNotificacion, solicitarPermisosNotificaciones } from "../utils/notifications";
import { CardFecha } from "./CardFecha";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const EstudianteMain = () => {

    
    //logica fechas 
    const [fechas, setFechas] = useState([]);
    console.log(fechas);

    const navigation = useNavigation();

    const {userData} = useUser();

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
        setFechas(resultados.map(aula => aula.fechas).flat());

    };

    cargarAulas();
    }, [userAulasIds]);

    

    //logica barra de tareas
    const [mainSection, setMainSection] = useState('aulas');
    const [section, setSection] = useState('clases');

    const [colorIconClases, setColorIconClases] = useState('')
    const [colorIconCrearAula, setColorIconIngresarAula] = useState('')
    const [colorIconEditarPerfil, setColorIconEditarPerfil] = useState('')

    useEffect(() => {
        setColorIconClases(section == 'clases' ? "#fafafa" : "#c3c3ccff")
        setColorIconIngresarAula(section == 'ingresarAula' ? "#fafafa" : "#c3c3ccff")
        setColorIconEditarPerfil(section == 'editarPerfil' ? "#fafafa" : "#c3c3ccff")
    }, [section])

    return (<>{loading ? <Loader /> : <View style={styles.container}>
        {
            section == 'clases' ? 
                <View style={styles.container}>
                     <Text style={styles.titleMainBienvenida}>{
                        hora >= 8 && hora < 12 ? 'Buenos días,' :
                        hora >= 12 && hora < 21 ? 'Buenas tardes,' :
                        (hora >= 21 || hora < 8) ? 'Buenas noches,' : null
                    }</Text>
                    <Text style={styles.titleMain}>{`${userData.nombre}! 😁`}</Text>
                    <View style={styles.mainNavBar}>
                        <TouchableOpacity onPress={() => setMainSection('aulas')} style={{justifyContent: 'center', width: '50%', alignItems: 'center',height: screenHeight * .055, backgroundColor: mainSection === 'aulas' ? '#39699E' : '#BFC3C4', borderRadius: 50}}>
                            <Text style={{...styles.mainNavBarText, fontWeight: 800,color: mainSection === 'aulas' ? '#FAFAFA' : '#273D5E'}}>Tus aulas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMainSection('fechas')} style={{justifyContent: 'center', width: '50%', alignItems: 'center',height: screenHeight * .055, backgroundColor: mainSection === 'fechas' ? '#39699E' : '#BFC3C4', borderRadius: 50}}>
                            <Text style={{...styles.mainNavBarText, fontWeight: 800,color: mainSection === 'fechas' ? '#FAFAFA' : '#273D5E'}}>Fechas</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {mainSection === 'aulas' ? <View style={styles.aulasContainer}>
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
                        :
                        <View>
                            {
                                fechas.map((fecha, index) => (
                                    <CardFecha key={index} fecha={fecha} />
                                ))
                            }
                        </View>    
                    }
                    </ScrollView>
                </View> : 
            section == 'ingresarAula' ? <IngresarAlAula /> :
            section == 'editarPerfil' ? <EditarPerfil /> : null
        }
        <View style={styles.utilityes}>
            <TouchableOpacity onPress={() => setSection('clases')} style={styles.utilityesButton}>
                <Entypo style={styles.utilityesButtonIcon} name="home" size={22} color={colorIconClases} />
                <Text style={{...styles.utilityesButtonText, color: colorIconClases}}>{section === 'clases' ? '.' : null}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSection('ingresarAula')} style={styles.utilityesButton}>
                <MaterialCommunityIcons style={styles.utilityesButtonIcon} name="google-classroom" size={22} color={colorIconCrearAula} />
                <Text style={{...styles.utilityesButtonText, color: colorIconCrearAula}}>{section === 'ingresarAula' ? '.' : null}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSection('editarPerfil')} style={styles.utilityesButton}>
                <FontAwesome5 style={styles.utilityesButtonIcon} name="user-circle" size={22} color={colorIconEditarPerfil} />
                <Text style={{...styles.utilityesButtonText, color: colorIconEditarPerfil}}>{section === 'editarPerfil' ? '.' : null}</Text>
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
    mainNavBar: {
        flexDirection: 'row',
        backgroundColor: '#BFC3C4',
        height: screenHeight * .055,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 15
    },
    mainNavBarText: {
        fontFamily: 'Roboto',
        fontSize: 16,
    },
    aulasContainer: {
        flex: 1,
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    utilityes: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        height: screenHeight * .07,
        backgroundColor: '#39699E',
        borderRadius: 50,
    },
    utilityesButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: screenHeight * .07,
    },
    utilityesButtonIcon: {
        width: 22,
        height: 22
    },
    utilityesButtonText: {
        fontSize: 40,
        position: 'absolute',
        top: 11
    }
})