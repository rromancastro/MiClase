import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase/firebaseConfig";
import { CachedSvg, Loader } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const screenWidth = Dimensions.get('window').width;

export default function UserInfoScreen() {

    const route = useRoute();
    const {userId} = route.params;

    const [userData, setUserData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserById = async () => {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Documento encontrado:", docSnap.data());
                setUserData({...docSnap.data(), id: docSnap.id});
                setLoading(false);
            } else {
                console.log("No existe el documento");
                return null;
            }
        }
        getUserById();
    }, [userId])

    return (
        <SafeAreaView style={styles.container}>
            {
                loading ? <Loader /> : <>
                <View style={styles.userAvatar}>
                    <CachedSvg uri={userData.avatarUrl} width="170" height="170" />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 25}}>
                    <Text style={{fontFamily: 'Roboto', fontWeight: 'bold', color: '#132337', fontSize: 44, lineHeight: 44}}>{userData.nombre}</Text>
                    <Text style={{fontFamily: 'Roboto', fontWeight: 'bold', color: '#132337', fontSize: 44, lineHeight: 44}}>{userData.apellido}</Text>
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <View style={{...styles.userInfoItem, width: screenWidth * .4, borderRightColor: '#ecececff', borderRightWidth: 1}}>
                        <Text style={styles.userInfoItemLabel}>Nombre</Text>
                        <Text style={styles.userInfoItemValue}>{userData.nombre}</Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .4, paddingLeft: 15}}>
                        <Text style={styles.userInfoItemLabel}>Apellido</Text>
                        <Text style={styles.userInfoItemValue}>{userData.apellido}</Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Puntos Obtenidos</Text>
                        <Text style={styles.userInfoItemValue}>{userData.puntosObtenidos ? userData.puntosObtenidos : 0} <MaterialCommunityIcons name="medal" size={24} color="#77848D" /></Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Email</Text>
                        <Text style={styles.userInfoItemValue}>{userData.email}</Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Rol</Text>
                        <Text style={styles.userInfoItemValue}>{userData.rol.charAt(0).toUpperCase() + userData.rol.slice(1)}</Text>
                    </View>
                    <View style={{...styles.userInfoItem, width: screenWidth * .8}}>
                        <Text style={styles.userInfoItemLabel}>Id del {userData.rol}</Text>
                        <Text style={styles.userInfoItemValue}>{userData.id}</Text>
                    </View>
                </View>
            </>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F5',
        justifyContent: 'center',
    },
    userAvatar: {
        width: 170,
        height: 170,
        alignSelf: 'center',
    },
    userInfoItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ecececff',
        paddingVertical: 10
    },
    userInfoItemLabel: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#77848D'
    },
    userInfoItemValue: {
        fontFamily: 'Roboto',
        fontSize: 24,
        color: '#132337',
        fontWeight: 'bold'
    }
});