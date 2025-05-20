import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { db } from "./firebaseConfig";

const getUserByEmail = async (email) => {

    const [user, setUser] = useState({})

  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    setUser({
        idL: doc.id,
        ...doc.data()
    })
  });

  return {user}
};

export default getUserByEmail