import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const getJuegoById = async (juegoId) => {
  try {
    const juegoRef = doc(db, "juegos", juegoId);
    const docSnap = await getDoc(juegoRef);

    if (docSnap.exists()) {
      const datosJuego = docSnap.data();
      console.log("Juego encontrado:", datosJuego);
      return datosJuego;
    } else {
      console.log("No se encontró el juego con ese ID.");
      return null;
    }
  } catch (error) {
    console.error("Error al buscar el juego:", error);
    return null;
  }
};

export default getJuegoById