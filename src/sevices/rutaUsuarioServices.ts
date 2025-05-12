import { axiosApi } from "../api/axiosApi";
import { rutaUsuarioProps } from "../core/interfaces/rutaUsuarioProps";


export const crearRutaUsuario = async (ruta: rutaUsuarioProps) => {
  try {
    const response = await axiosApi.post(`/crear-ruta-usuario`, ruta, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error:any) {
    if (error.response && error.response.data||error.request) {
      throw new Error(error.response.data.message || "Error al crear la ruta");
    }
    throw new Error( error.message);
  }
  };