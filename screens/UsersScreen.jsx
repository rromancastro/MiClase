import { useRoute } from "@react-navigation/native";
import { UsersComponent } from "../components/UsersComponent";

export default function UsersScreen() {

    const route = useRoute();
    const {dataAula} = route.params;

    return (
        <UsersComponent dataAula={dataAula} />
    )
}