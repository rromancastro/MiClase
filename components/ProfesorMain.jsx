import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CardAula } from "./CardAula";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import getAulaById from "../firebase/getAulaByIds";
import { CrearAula } from "./CrearAula";
import { EditarPerfil } from "./EditarPerfil";
import { Loader } from "./Loader";
import { CardFecha } from "./CardFecha";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const ProfesorMain = () => {

    //logica fechas 
    const [fechas, setFechas] = useState([]);
    console.log(fechas);


    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);

    const {userData} = useUser();
    console.log(userData)

    //logica hora bienvenida
    const date = new Date();
    const hora = date.getHours();
    console.log(hora);
    

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
        setLoading(false);
        setFechas(
            resultados
                .map(aula => aula.fechas.map(fecha => ({ ...fecha, nombreAula: aula.nombre })))
                .flat()
            );
    };

    cargarAulas();
    }, [userAulasIds]);

    

    //logica barra de tareas
    const [mainSection, setMainSection] = useState('aulas');
    const [section, setSection] = useState('clases');

    const [colorIconClases, setColorIconClases] = useState('')
    const [colorIconCrearAula, setColorIconCrearAula] = useState('')
    const [colorIconEditarPerfil, setColorIconEditarPerfil] = useState('')

    useEffect(() => {
        setColorIconClases(section == 'clases' ? "#fafafa" : "#c3c3ccff")
        setColorIconCrearAula(section == 'crearAula' ? "#fafafa" : "#c3c3ccff")
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
                        <TouchableOpacity onPress={() => setMainSection('aulas')} style={{justifyContent: 'center', width: '48%', alignItems: 'center',height: screenHeight * .055, backgroundColor: mainSection === 'aulas' ? '#39699E' : '#fafafa', borderRadius: 50, boxShadow: mainSection === 'aulas' ? '4px 1px 0px #DBDCDC, 3px 3px 0px #DBDCDC ' : null}}>
                            <Text style={{...styles.mainNavBarText, fontWeight: 800,color: mainSection === 'aulas' ? '#FAFAFA' : '#273D5E'}}>Tus aulas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMainSection('fechas')} style={{justifyContent: 'center', width: '48%', alignItems: 'center',height: screenHeight * .055, backgroundColor: mainSection === 'fechas' ? '#39699E' : '#fafafa', borderRadius: 50, boxShadow: mainSection === 'fechas' ? '-4px 1px 0px #DBDCDC, -3px 3px 0px #DBDCDC' : null}}>
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
            section == 'crearAula' ? <CrearAula /> :
            section == 'editarPerfil' ? <EditarPerfil /> : null
        }
        <View style={styles.utilityes}>
            <TouchableOpacity onPress={() => setSection('clases')} style={styles.utilityesButton}>
                <Entypo style={styles.utilityesButtonIcon} name="home" size={22} color={colorIconClases} />
                <Text style={{...styles.utilityesButtonText, color: colorIconClases}}>{section === 'clases' ? '.' : null}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSection('crearAula')} style={styles.utilityesButton}>
                <MaterialIcons style={styles.utilityesButtonIcon} name="my-library-add" size={22} color={colorIconCrearAula} />
                <Text style={{...styles.utilityesButtonText, color: colorIconCrearAula}}>{section === 'crearAula' ? '.' : null}</Text>
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
        gap: 10,
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
        backgroundColor: '#fafafa',
        height: screenHeight * .055,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 15,
        boxShadow: '3px 3px 0px #DBDCDC'
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
        boxShadow: '3px 3px 0px #DBDCDC'
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