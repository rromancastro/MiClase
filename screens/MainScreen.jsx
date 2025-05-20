import { Text, View } from "react-native";
import { useUser } from "../contexts/UserContext";

export default function MainScreen(){

    const { userData } = useUser();
    

    return(
        <View>
            <Text>{`¡Hola, ${userData.rol}!`}</Text>
        </View>
    )
}