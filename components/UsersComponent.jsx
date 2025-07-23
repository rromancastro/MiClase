import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUser } from '../contexts/UserContext';
import Entypo from '@expo/vector-icons/Entypo';
import { db } from '../firebase/firebaseConfig';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg from 'react-native-svg';
import { CachedSvg } from './CachedSvg';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const UsersComponent = ({dataAula}) => {

    const {userData} = useUser();

    const rol = userData.rol;


    const navigation = useNavigation();

    const [estudiantes, setEstudiantes] = useState(dataAula.estudiantes || []);
    
    const profesores = dataAula.profesores || [];

    const [usersSection, setUsersSection] = useState('alumnos')

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        estudiantes.length === 0 ? setLoading(true) : setLoading(false);
    }, [estudiantes])

    const handleEliminarAlumno = async (id) => {
        const userRef = doc(db, "users", id);
        const aulaRef = doc(db, "aulas", dataAula.id);

        const newEstudiantes = estudiantes.filter(estudiante => estudiante.id !== id);


        try {
            await updateDoc(aulaRef, {
                estudiantes: newEstudiantes
            });
            await updateDoc(userRef, {
                aulas: arrayRemove(dataAula.id)
            });
            setEstudiantes(newEstudiantes)
        } catch (error) {
            console.log(error);
        }
    }

    console.log(estudiantes);
    

    return (<SafeAreaView style={{...styles.container, justifyContent: 'center', alignItems: 'center'}}>
        <ScrollView key={estudiantes}  style={styles.container}>
                    <Text style={{fontFamily: 'Roboto', fontSize: 49, alignSelf: 'flex-start', fontWeight: '700', color: '#373B45', marginTop: 40}}>Participantes</Text>
                    
                    
                    <View style={styles.mainNavBar}>
                        <TouchableOpacity onPress={() => setUsersSection('alumnos')} style={{justifyContent: 'center', width: '48%', alignItems: 'center',height: screenHeight * .055, backgroundColor: usersSection === 'alumnos' ? '#39699E' : '#fafafa', borderRadius: 50, boxShadow: usersSection === 'alumnos' ? '4px 1px 0px #DBDCDC, 3px 3px 0px #DBDCDC ' : null}}>
                            <Text style={{...styles.mainNavBarText, fontWeight: 800,color: usersSection === 'alumnos' ? '#FAFAFA' : '#273D5E'}}>Alumnos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setUsersSection('profesores')} style={{justifyContent: 'center', width: '48%', alignItems: 'center',height: screenHeight * .055, backgroundColor: usersSection === 'profesores' ? '#39699E' : '#fafafa', borderRadius: 50, boxShadow: usersSection === 'profesores' ? '-4px 1px 0px #DBDCDC, -3px 3px 0px #DBDCDC' : null}}>
                            <Text style={{...styles.mainNavBarText, fontWeight: 800,color: usersSection === 'profesores' ? '#FAFAFA' : '#273D5E'}}>Profesores</Text>
                        </TouchableOpacity>
                    </View>

                    {usersSection === 'profesores' ?
                        profesores.map((profesor, index) => {
                            return (
                                <View key={index} style={{flexDirection: 'row', alignItems: 'center',  gap: 10, marginVertical: 5}}>
                                {dataAula.profesorAvatarUrl ? <CachedSvg uri={dataAula.profesorAvatarUrl} width="80" height="80" /> : null}

                                <View style={{alignItems: 'flex-start'}}>
                                    <Text style={{...styles.userItem, fontSize: 24, color: '#373B45'}}>{profesor}</Text>
                                    <Text style={{...styles.userItem, fontSize: 16, color: '#273D5E'}}>Profesor/a</Text>
                                </View>
                                </View>
                            )
                        })
                     :
                        estudiantes.map((estudiante, index) => {
                            return (<View key={estudiante.id} style={{flexDirection: 'row', alignItems: 'center',  gap: 10, marginVertical: 5}}>
                                {estudiante.avatarUrl ? <CachedSvg uri={estudiante.avatarUrl} width="80" height="80" /> : null}

                                <View style={{alignItems: 'flex-start'}}>
                                    <Text style={{...styles.userItem, fontSize: 24, color: '#373B45'}}>{estudiante.nombre} {estudiante.apellido}</Text>
                                    <Text style={{...styles.userItem, fontSize: 16, color: '#273D5E'}}>Alumno/a</Text>
                                </View>
                                <TouchableOpacity onPress={ () =>
                                    Alert.alert(
                                        "Eliminar alumno",
                                        "¿Estás seguro de que querés eliminar este alumno?",
                                        [
                                            { text: "Cancelar", style: "cancel" },
                                            { text: "Eliminar", onPress: () => handleEliminarAlumno(estudiante.id), style: "destructive" }
                                        ]
                                    )
                                } style={{marginLeft: 'auto'}}><Entypo name="circle-with-cross" size={24} color="red" /></TouchableOpacity>
                            </View>)
                        })
                    }
                </ScrollView>
    </SafeAreaView>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#7F8488',
        fontFamily: 'Roboto'
    },
    userItem: {
        fontSize: 16,
        textAlign: 'center',
        color: '#7F8488',
        fontFamily: 'Roboto'
    },
    mainNavBar: {
        flexDirection: 'row',
        backgroundColor: '#fafafa',
        height: screenHeight * .055,
        width: screenWidth * .85,
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
})