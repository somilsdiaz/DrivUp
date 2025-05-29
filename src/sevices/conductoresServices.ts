
import { axiosApi } from "../api/axiosApi";
import { DatosUpdateProps } from "../core/interfaces/conductorProps";
import { getUserId } from "../utils/auth";

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
   console.log(response.data);
   return response.data;
  }catch(error:any){
    throw new Error("Error al traer los datos del conductor. Error: " + error.message);
  }
}

export async function getConductorUsedId(id:number){
  try{
   const response= await axiosApi.get(`/conductorUserId?id=${id}`, {
    headers: { "Content-Type": "application/json" },
   })
   if(!response){
    throw new Error("No se encontro el conductor con el id proporcionado.");
   }
   return response.data[0];
  }catch(error:any){
    throw new Error("Error al traer el id del conductor. Error: " + error.message);
  }
}

export async function getConductorId(){
  try{
   const response= await axiosApi.get(`/idConductor?id=${Number(getUserId())}`, {
    headers: { "Content-Type": "application/json" },
   })
   if(!response){
    throw new Error("No se encontro el conductor con el id proporcionado.");
   }
   return response.data[0];
  }catch(error:any){
    throw new Error("Error al traer el id del conductor. Error: " + error.message);
  }
}

export async function updateDatos(data:DatosUpdateProps){
  console.log(data);
  try{
   const response= await axiosApi.put(`/actualizar`,data, {
    headers: { "Content-Type": "application/json" },
   })
   return response.data[0];
  }catch(error:any){
    throw new Error("Error al traer los datos del conductor. Error: " + error.message);
  }
}