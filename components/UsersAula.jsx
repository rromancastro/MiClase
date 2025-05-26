import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const UsersAula = ({dataAula}) => {

    const estudiantes = dataAula.estudiantes || [];
    const profesores = dataAula.profesores || [];

    return (<ScrollView style={styles.container}>
        <Text style={styles.subtitle}>Profesor/res:</Text>
        {
            profesores.map((profesor) => {
                return (
                    <Text key={profesor} style={styles.userItem}>{profesor}</Text>
                )
            })
        }
        <Text style={styles.subtitle}>Alumnos:</Text>
        {
            estudiantes.length > 0 ? estudiantes.map((estudiante) => {
                return (
                    <Text key={estudiante.id} style={styles.userItem}>{estudiante.nombre}</Text>
                )
            }) : null
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