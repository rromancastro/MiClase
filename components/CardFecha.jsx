import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions, StyleSheet, Text, View } from "react-native"

const screenWidth = Dimensions.get('window').width;

export const CardFecha = ({fecha}) => {
    

    const timestamp = fecha.fecha.toDate().getTime();
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // los meses empiezan en 0
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    console.log(formattedDate);

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ]

    

    return (
        <View style={styles.fechaCard}>
            <View>
                <Ionicons name="newspaper-outline" size={35} color="#373B46" />
                <AntDesign name="checkcircle" size={14} color="#368954" style={{position: 'absolute', backgroundColor: 'white', padding: 1, borderRadius: 25, bottom: 0, right: 0}} />
            </View>
                        <View>
                            <Text style={{fontFamily: 'Roboto', fontWeight: '700', color: '#373B46', fontSize: 20, paddingRight: 60}}>{fecha.nombre} - {fecha.nombreAula}</Text>
                            <Text style={{fontFamily: 'Roboto', fontWeight: '500', color: '#373B46', fontSize: 16, paddingRight: 60}}>Fecha / Entrega: {formattedDate.slice(0, 5)}</Text>
                        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fechaCard: {
        backgroundColor: '#fafafa',
        width: screenWidth * 0.85,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        paddingLeft: 20,
        marginVertical: 5,
        boxShadow: '3px 3px 0px #DBDCDC'
    }
})