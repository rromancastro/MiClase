import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

const emailExists = async (email) => {

    const q = query(
        collection(db, "users"),
        where("email", "==", email)
    );

    const querySnapshot = await getDocs(q);

     return !querySnapshot.empty;
}

export default emailExists