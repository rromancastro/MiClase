import { useState } from "react";
import { Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useUser } from "../contexts/UserContext";
import { arrayRemove, arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Toast from "react-native-toast-message";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const Calendario = ({ dataAula }) => {

    const navigation = useNavigation();

    const anioActual = new Date().getFullYear();

    const {userData} = useUser();
    const [selectedDate, setSelectedDate] = useState('');

    const fechas = dataAula.fechas || [];

    const fechasFormateadas = (dataAula.fechas || []).map(item => {
        const date = item.fecha.toDate();
        const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return formatted;
    });
    console.log(dataAula.fechas);

    LocaleConfig.locales['es'] = {
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        today: 'Hoy',
    }

    LocaleConfig.defaultLocale = 'es';
    
    

    const markedDates = fechasFormateadas.reduce((acc, fechaStr) => {
        acc[fechaStr] = {
        selected: true,
        selectedColor: '#368954'
        };
        return acc;
    }, {});

    if (selectedDate) {
        markedDates[selectedDate] = {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        disableTouchEvent: true
        };
    }

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

    const handleEliminarFecha = async (fecha) => {
        try {
            const aulaRef = doc(db, "aulas", dataAula.id);
            await updateDoc(aulaRef, {
                fechas: arrayRemove(fecha)
            });
            Toast.show({
                type: 'success',
                text1: '¡La fecha fue eliminda!',
                text2: 'Vuelve a ingresar al aula para ver los cambios',
            });
        } catch (error) {
            console.error("Error al eliminar la fecha:", error);
        }
    }

    //ordenar fechas
    fechasFormateadas.sort((a, b) => a.localeCompare(b));
    fechas.sort((a, b) => a.fecha.toDate().getTime() - b.fecha.toDate().getTime());

    //logica crear fechas
    const [nombreFecha, setNombreFecha] = useState('');
    const [mesFecha, setMesFecha] = useState('1');
    const [diaFecha, setDiaFecha] = useState('1');
    
    const handleCrearFecha = async () => {
        const aulaRef = doc(db, "aulas", dataAula.id);

        try {
            await updateDoc(aulaRef, {
                fechas: arrayUnion({
                    nombre: nombreFecha,
                    fecha: Timestamp.fromDate(new Date(`${anioActual}-${mesFecha}-${diaFecha}T00:00:00`))
                })
            });
            Toast.show({
                type: 'success',
                text1: '¡La fecha fue creada!',
                text2: 'Vuelve a ingresar al aula para ver los cambios',
            });
        } catch (error) {
            console.error("Error al crear la fecha:", error);
        }
    }

  return (
    <SafeAreaView style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 40, alignSelf: 'flex-start', marginLeft: 40}}>
                        <Text style={{fontFamily: 'Roboto', fontSize: 49, alignSelf: 'flex-start', fontWeight: '700', color: '#373B45'}}>Calendario</Text>
                    </View>
                          <Calendar
                            firstDay={1}
                            onDayPress={day => {
                              setSelectedDate(day.dateString);
                            }}
                            markedDates={markedDates}
                            style={styles.calendario}
                            theme={{
                                calendarBackground: '#F6F6F5',
                                textSectionTitleColor: '#373B46',
                                selectedDayBackgroundColor: '#577AB8',
                                selectedDayTextColor: '#fafafa',
                                todayBackgroundColor: '#FFC24E',
                                todayTextColor: '#373B46',
                                dayTextColor: '#373B46',
                                textDisabledColor: '#d9e1e8',
                                arrowColor: '#368954',
                                monthTextColor: '#373B46',
                                textDayFontFamily: 'Roboto',
                                textMonthFontWeight: 'bold',
                                textDayFontSize: 16,
                                textMonthFontSize: 20,
                                textDayHeaderFontSize: 14,
                            }}
                          />
                    
                            {userData.rol == 'profesor' ? <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <View style={styles.fechaCard}>
                    <View>
                        <Ionicons name="newspaper-outline" size={35} color="#373B46" />
                        <MaterialIcons name="add-circle" size={16} color="#577AB8" style={{position: 'absolute', backgroundColor: 'white', padding: 1, borderRadius: 25, bottom: 0, right: 0}} />
                    </View>
                    <View>
                        <TextInput value={nombreFecha} onChangeText={setNombreFecha} placeholder="Nombre de la fecha" style={{fontFamily: 'Roboto', fontSize: 16, width: screenWidth * .6,}}/>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 100}}>
                            <Picker
                                selectedValue={diaFecha}
                                style={{width: 100,}}
                                onValueChange={(itemValue) => setDiaFecha(itemValue)}
                            >
                                <Picker.Item label="1" value="01" />
                                <Picker.Item label="2" value="02" />
                                <Picker.Item label="3" value="03" />
                                <Picker.Item label="4" value="04" />
                                <Picker.Item label="5" value="05" />
                                <Picker.Item label="6" value="06" />
                                <Picker.Item label="7" value="07" />
                                <Picker.Item label="8" value="08" />
                                <Picker.Item label="9" value="09" />
                                <Picker.Item label="10" value="10" />
                                <Picker.Item label="11" value="11" />
                                <Picker.Item label="12" value="12" />
                                <Picker.Item label="13" value="13" />
                                <Picker.Item label="14" value="14" />
                                <Picker.Item label="15" value="15" />
                                <Picker.Item label="16" value="16" />
                                <Picker.Item label="17" value="17" />
                                <Picker.Item label="18" value="18" />
                                <Picker.Item label="19" value="19" />
                                <Picker.Item label="20" value="20" />
                                <Picker.Item label="21" value="21" />
                                <Picker.Item label="22" value="22" />
                                <Picker.Item label="23" value="23" />
                                <Picker.Item label="24" value="24" />
                                <Picker.Item label="25" value="25" />
                                <Picker.Item label="26" value="26" />
                                <Picker.Item label="27" value="27" />
                                <Picker.Item label="28" value="28" />
                                <Picker.Item label="29" value="29" />
                                <Picker.Item label="30" value="30" />
                                <Picker.Item label="31" value="31" />
                            </Picker>
                            <Text> / </Text>
                            <Picker
                                selectedValue={mesFecha}
                                style={{width: 100}}
                                onValueChange={(itemValue) => setMesFecha(itemValue)}
                            >
                                <Picker.Item label="1" value="01" />
                                <Picker.Item label="2" value="02" />
                                <Picker.Item label="3" value="03" />
                                <Picker.Item label="4" value="04" />
                                <Picker.Item label="5" value="05" />
                                <Picker.Item label="6" value="06" />
                                <Picker.Item label="7" value="07" />
                                <Picker.Item label="8" value="08" />
                                <Picker.Item label="9" value="09" />
                                <Picker.Item label="10" value="10" />
                                <Picker.Item label="11" value="11" />
                                <Picker.Item label="12" value="12" />
                            </Picker>
                            <Text> / {anioActual}</Text>
                            </View>
                    </View>
                    <TouchableOpacity onPress={handleCrearFecha}>
                        <MaterialIcons name="add-circle" size={26} color="#577AB8"/>
                    </TouchableOpacity>
                                </View>
                            </View> : null}
                    
                        
                            <View key={fechasFormateadas}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20,gap: 10}}>
                                {
                    fechasFormateadas.map((fecha, index) => (
                        <View key={fecha} style={styles.fechaCard}>
                            <View>
                                <Ionicons name="newspaper-outline" size={35} color="#373B46" />
                                <AntDesign name="checkcircle" size={14} color="#368954" style={{position: 'absolute', backgroundColor: 'white', padding: 1, borderRadius: 25, bottom: 0, right: 0}} />
                            </View>
                            <View>
                                <Text style={{fontFamily: 'Roboto', fontWeight: '700', color: '#373B46', fontSize: 20, paddingRight: 60}}>{fechas[index].nombre}</Text>
                                <Text style={{fontFamily: 'Roboto', fontWeight: '500', color: '#373B46', fontSize: 16, paddingRight: 60}}>Fecha / Entrega: {fecha.slice(8, 10)} de {meses[Number(fecha.slice(5, 7)) - 1]}</Text>
                            </View>
                            {
                                userData.rol == 'profesor' ? <TouchableOpacity style={{position: 'absolute', right: 20}}
                                                                onPress={ () =>
                                                                            Alert.alert(
                                                                                "Eliminar fecha",
                                                                                "¿Estás seguro de que querés eliminar esta fecha?",
                                                                                [
                                                                                    { text: "Cancelar", style: "cancel" },
                                                                                    { text: "Eliminar", onPress: () => handleEliminarFecha(fechas[index]), style: "destructive" }
                                                                                ]
                                                                            )
                                                                        }
                                                            ><Entypo name="circle-with-cross" size={20} color="#CB291F" /></TouchableOpacity> : null
                            }
                        </View>
                    ))
                                }
                                
                            </View>
                          </View>
                </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: 40,
        fontWeight: 700,
        marginTop: 40,
        marginLeft: 20,
        color: '#373B46'
    },
    calendario: {
        marginTop: 20,
        backgroundColor: '#F6F6F5',
        marginHorizontal: 20,
    },
    fechaCard: {
        backgroundColor: '#fafafa',
        boxShadow: '3px 3px 0px #DBDCDC',
        width: screenWidth * 0.9,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        paddingLeft: 20,
    }
})