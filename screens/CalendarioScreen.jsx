import { useRoute } from "@react-navigation/native";
import { Text } from "react-native";
import { Calendario } from "../components";

export default function CalendarioScreen() {

        const route = useRoute();
        const {dataAula} = route.params;

    return (
        <Calendario dataAula={dataAula} />
    )
}