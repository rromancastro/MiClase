import { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get('window').width;


export const IngresarAlAula = () => {

    const navigation = useNavigation();

    const [codigoAula, setCodigoAula] = useState('');

    const {userData, setUserData} = useUser();

    const [error, setError] = useState(false);

    const handleIngresar = async () => {
        try {

            const aulasRef = collection(db, "aulas");
            const q = query(aulasRef, where("codigo", "==", codigoAula));

            let aula = null;

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                aula = { id: doc.id, ...doc.data() };
                
            });

            await updateDoc(doc(db, "users", userData.id), {
                    aulas: arrayUnion(aula.id)
                });

            await updateDoc(doc(db, "aulas", aula.id), {
                estudiantes: arrayUnion({...userData})
            });

            setUserData({
                ...userData,
                aulas: [...userData.aulas, aula.id]
            })

            
            
            setError(false);
            navigation.replace("Main")
            

        } catch (error) {
            console.error(error);
            setError(true);
        }
    }


    return (
        <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
            <MaterialCommunityIcons name="google-classroom" size={124} color="#5090E6" />
            <Text style={styles.title}>Ingresar al aula</Text>
            <TextInput value={codigoAula} keyboardType="numeric" onChangeText={setCodigoAula} maxLength={6} placeholder="Código de aula (6 Caracteres)" placeholderTextColor={'grey'} style={styles.input} />
            {
                error ? <Text style={{color: 'red', fontFamily: 'Roboto', fontSize: 18,marginVertical: 10}}>El código de aula no es valido</Text> : null
            }
            <TouchableOpacity onPress={handleIngresar} ><Text style={styles.crearButtonText}>Ingresar</Text></TouchableOpacity>
            
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: '600',
        color: '#272625',
        marginBottom: 20
    },
    input: {
        width: screenWidth * 0.85,
        height: 70,
        borderWidth: 1,
        outlineStyle: 'none',
        borderColor: '#E3E8EC',
        borderRadius: 20,
        fontFamily: 'Roboto',
        placeholder: 'grey',
        padding: 20,
        fontSize: 18,
        color: '#272625',
        marginVertical: 10,
    },
    crearButtonText: {
        color: "#fafafa",
        fontFamily: 'Roboto',
        fontSize: 18,
        width: screenWidth * 0.85,
        backgroundColor: '#5090E6',
        borderRadius: 20,
        fontWeight: 600,
        padding: 20,
        textAlign: 'center',
        fontWeight: '700',
    },
})