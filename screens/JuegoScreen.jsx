import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import getJuegoById from "../firebase/getJuegoById";
import { View } from "react-native";
import { ImpostorJuego, TriviaJuego, VerdaderoFalsoJuego } from "../juegosComponents" 
import { Loader } from "../components";
import { Audio } from "expo-av";

export default function JuegoScreen() {

    const route = useRoute();
    const {juegoId} = route.params;

    const [juegoData, setJuegoData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJuegoById(juegoId)
        .then(data => {
            setJuegoData(data)
            setLoading(false)
        })
        .catch(error => console.error('Error al obtener el juego:', error));
    }, [juegoId])

    //logica musica
    const sound = useRef(null);

    useEffect(() => {
        async function playMusic() {
        const { sound: soundObject } = await Audio.Sound.createAsync(
            require('../assets/musicaJuego.mp3'),
            {
            shouldPlay: true,
            isLooping: true,
            }
        );
        sound.current = soundObject;
        }

        playMusic();

        return () => {
        if (sound.current) {
            sound.current.unloadAsync();
        }
        };
    }, []);

    return (<>
        {
            loading ? <Loader /> : 

            juegoData.tipo == 'verdaderoFalso' ? <VerdaderoFalsoJuego juegoId={juegoId} /> :
            juegoData.tipo == 'trivia' ? <TriviaJuego juegoId={juegoId} /> :
            juegoData.tipo == 'impostor' ? <ImpostorJuego juegoId={juegoId} /> : null
        }
    </>)
}