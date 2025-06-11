import { Text, View } from "react-native";
import { useUser } from "../contexts/UserContext";
import { AulaComponent, Loader, } from "../components";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { StatusBar } from "expo-status-bar";

export default function AulaScreen() {
        const {userData} = useUser();
        
        const route = useRoute();
        const {aulaId} = route.params;

        const [aula, setAula] = useState(null);

        useEffect(() => {
            const fetchAula = async () => {
            try {
                const docRef = doc(db, 'aulas', aulaId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                setAula({...docSnap.data(), id: docSnap.id});
                } else {
                console.log('No existe el aula');
                }
            } catch (error) {
                console.error('Error al obtener el aula:', error);
            }
            };

            fetchAula();
        }, [aulaId]);

        if (!aula) return <Loader />;

//     const aulaPrueba = {
//     color: "#F16A62",
//     createdAt: {
//         "seconds": 1748456430,
//         "nanoseconds": 391000000
//     },
//     emailProfesor: "rp@gmail.com",
//     nombreProfesor: "Roman",
//     apellidoProfesor: "Castro",
//     codigo: "873919",
//     profesores: [
//         "Roman Castro"
//     ],
//     nombre: "Historia",
//     estudiantes: [],
//     icono: "book",
//     id: 'Rn8Q87J2gCWKnlNtpJtX'
// }

//     const userData = {
//         rol: 'profesor'
//     }

    return (
        <View style={{backgroundColor: '#FBFBFB', flex: 1}}>
            <AulaComponent dataAula={aula} />
        </View>
    )
}