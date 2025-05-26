import { Text, View } from "react-native";
import { useUser } from "../contexts/UserContext";
import { EstudianteAula, Loader, ProfesoraAula } from "../components";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

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

    return (
        <View style={{backgroundColor: '#F8F6F0', flex: 1}}>
            {
                userData.rol == 'profesor' ? <ProfesoraAula dataAula={aula} /> : <EstudianteAula />
            }
        </View>
    )
}