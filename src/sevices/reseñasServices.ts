import { axiosApi } from "../api/axiosApi";
import { ReseñaSubirProps } from "../core/interfaces/ReseñaProps";

export const crearReseña = async (reseña: ReseñaSubirProps) => {
  try {
    const response = await axiosApi.post(`/subirResena`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reseña),
    });

    return response.data;
  } catch (error:any) {
    if (error.response && error.response.data||error.request) {
      throw new Error(error.response.data.message || "Error al crear la reseña");
    }
    throw new Error( error.message);
  }
  };



export const traerReseñas = async (conductor_Id:string) => {
   
  try {
    const response = await axiosApi.get(`/traerResenas?conductor_id=${conductor_Id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error in retrieving the tasks. Error: " + error.message);
  }
};
