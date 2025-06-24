import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUser } from '../contexts/UserContext';
import Entypo from '@expo/vector-icons/Entypo';
import { db } from '../firebase/firebaseConfig';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const UsersAula = ({dataAula}) => {

    const {userData} = useUser();

    const rol = userData.rol;


    const navigation = useNavigation();

    const [estudiantes, setEstudiantes] = useState(dataAula.estudiantes || []);
    
    const profesores = dataAula.profesores || [];

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

    return (<ScrollView key={estudiantes}  style={styles.container}>
                <View style={styles.nav}>
                    <TouchableOpacity onPress={() => navigation.replace("Aula", {aulaId: dataAula.id})}><AntDesign name="arrowleft" size={34} color='#363838' style={styles.navBack} /></TouchableOpacity>
                    <Text style={styles.navText}>Participantes</Text>
                </View>
                <Text style={styles.subtitle}>👨‍🏫 Profesor/res: 👩‍🏫</Text>
                {
                    profesores.map((profesor) => {
                        return (
                            <Text key={profesor} style={styles.userItem}>{profesor}</Text>
                        )
                    })
                }
                <Text style={styles.subtitle}>🧑‍🎓 Alumnos: 👩‍🎓</Text>
                {
                    userData.rol === "profesor" ? estudiantes.map((estudiante) => {
                        return (<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10}}>
                            <TouchableOpacity onPress={ () =>
                                Alert.alert(
                                    "Eliminar alumno",
                                    "¿Estás seguro de que querés eliminar este alumno?",
                                    [
                                        { text: "Cancelar", style: "cancel" },
                                        { text: "Eliminar", onPress: () => handleEliminarAlumno(estudiante.id), style: "destructive" }
                                    ]
                                )
                            }><Entypo name="circle-with-cross" size={24} color="red" /></TouchableOpacity>
                            <Text key={estudiante} style={styles.userItem}>{estudiante.nombre} {estudiante.apellido}</Text>
                        </View>)
                    }) : estudiantes.map((estudiante) => {
                        return (
                            <Text key={estudiante} style={styles.userItem}>{estudiante.nombre} {estudiante.apellido}</Text>
                        )
                    })
                }
            </ScrollView>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: screenWidth * .1,
        height: screenHeight * .08,
        borderBottomColor: '#EFEEE7',
        borderBottomWidth: 1,
        width: screenWidth
    },
    navBack: {
        height: 34,
        width: 34,
    },
    navText: {
        color: '#363838',
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 600,
        marginLeft: 20
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
        marginVertical: 5,
        color: '#7F8488',
        fontFamily: 'Roboto'
    }   
})