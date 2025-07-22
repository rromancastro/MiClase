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
                    <Text style={{fontFamily: 'Roboto', fontSize: 49, alignSelf: 'flex-start', fontWeight: '700', color: '#373B45'}}>Participantes</Text>

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