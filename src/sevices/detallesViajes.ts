import { axiosApi } from "../api/axiosApi";

export const traerDetallesViaje = async (idViaje:number) => {
   
  try {
    const response = await axiosApi.get(`/traerDatosViaje?id_viaje=${idViaje}`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error in retrieving the tasks. Error: " + error.message);
  }
};