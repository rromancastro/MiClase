import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const getAulaById = async (aulaId) => {
  try {
    const aulaRef = doc(db, "aulas", aulaId);
    const docSnap = await getDoc(aulaRef);

    if (docSnap.exists()) {
      const datosAula = docSnap.data();
      console.log("Aula encontrada:", datosAula);
      return datosAula;
    } else {
      console.log("No se encontró el aula con ese ID.");
      return null;
    }
  } catch (error) {
    console.error("Error al buscar el aula:", error);
    return null;
  }
};

export default getAulaById