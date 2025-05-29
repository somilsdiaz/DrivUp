import { axiosApi } from "../api/axiosApi";

export const getViajesConductor = async (id:number) => {
   
  try {
    const response = await axiosApi.get(`/lista-viajes-conductor?id=${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error al traer la lista. Error: " + error.message);
  }
};

export const getViajesPasajero = async (id:number) => {
   
  try {
    const response = await axiosApi.get(`/lista-viajes-pasajero?id=${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error al traer la lista. Error: " + error.message);
  }
};