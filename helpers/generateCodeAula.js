import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const generateCodeAula = async () => {
  let codigoUnicoEncontrado = false;
  let nuevoCodigo = "";

  while (!codigoUnicoEncontrado) {
    const random = Math.floor(Math.random() * 1000000);
    nuevoCodigo = random.toString().padStart(6, "0");

    const aulasRef = collection(db, "aulas");
    const q = query(aulasRef, where("codigo", "==", nuevoCodigo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      codigoUnicoEncontrado = true;
    }
  }

  return nuevoCodigo;
};

export default generateCodeAula