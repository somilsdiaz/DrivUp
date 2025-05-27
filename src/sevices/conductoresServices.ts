
import { axiosApi } from "../api/axiosApi";
import { DatosUpdateProps } from "../core/interfaces/conductorProps";

export async function getConductores(){
  try{
   const response= await axiosApi.get(`/conductores`, {
    headers: { "Content-Type": "application/json" },
   })
   return response.data;
  }catch(error:any){
    throw new Error("Error al traer los datos del conductor. Error: " + error.message);
  }
}

export async function getConductorById(id:number){
  try{
   const response= await axiosApi.get(`/datoconductor?id=${id}`, {
    headers: { "Content-Type": "application/json" },
   })
   return response.data[0];
  }catch(error:any){
    throw new Error("Error al traer los datos del conductor. Error: " + error.message);
  }
}

export async function updateDatos(data:DatosUpdateProps){
  try{
   const response= await axiosApi.patch(`/actualizar`,data, {
    headers: { "Content-Type": "application/json" },
   })
   return response.data[0];
  }catch(error:any){
    throw new Error("Error al traer los datos del conductor. Error: " + error.message);
  }
}