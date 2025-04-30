import { axiosApi } from "../api/axiosApi";

export async function getConductor(conductor_Id:string){
  try{
   const response= await axiosApi.get(`/traerConductor?conductor_id=${conductor_Id}`, {
    headers: { "Content-Type": "application/json" },
   })
   return response.data;
  }catch(error:any){
    throw new Error("Error al traer los datos del conductor. Error: " + error.message);
  }
}