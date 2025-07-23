import { useRoute } from "@react-navigation/native";
import { ChatComponent } from "../components";

export default function ChatScreen() {
    
        const route = useRoute();
        const {aulaId} = route.params;

        return (
            <ChatComponent aulaId={aulaId} />
        )
}