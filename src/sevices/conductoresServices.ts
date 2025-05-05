import { axiosApi } from "../api/axiosApi";

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