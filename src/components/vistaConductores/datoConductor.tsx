
import { getUserId } from "../../utils/auth";
import { useGetConductorById } from "../../hooks/useGetConductordata";

import { DatosVehiculo } from "../vistaPasajeros/detallesConductor/datosVehiculo";
import { DatosRuta } from "../vistaPasajeros/detallesConductor/datosRuta";
import { useState } from "react";
import ActualizarDatosConductor from "./actualizarDatosConductor";




export function DatoConductor(){
    const id=getUserId();
    const {data:conductor}=useGetConductorById(Number(id));
    const [update,setUpdate]=useState<boolean>(false);
   
   if(conductor){
       
           const conductorVehiculoProps = {
               modelo_vehiculo: conductor.modelo_de_vehiculo,
               marca_vehiculo: conductor.marca_de_vehiculo,
               color_vehiculo: conductor.color_del_vehiculo,
               año_vehiculo: conductor.año_del_vehiculo, 
               capacidad_de_pasajeros: conductor.capacidad_de_pasajeros,
           };
           const datosRutasProps = {
               origen: conductor.origen_aproximado,
               destino: conductor.destino_aproximado,
               descripcion: conductor.descripcion,
           };
    if(!update){
         return (
        <>
                     <DatosVehiculo {...conductorVehiculoProps}/>
                     <DatosRuta {...datosRutasProps} />
                    <section className="flex justify-center mt-10">
                         <button 
                     onClick={()=>setUpdate(true)}
                     className="p-2 bg-[#F2B134] w-4/12 mx-auto text-[#4A4E69] font-bold
         rounded-sm cursor-pointer hover:bg-[#F2B134]/90 transition-all transform hover:scale-110 group">
            Editar datos</button>
                    </section>
        </>
    );
    }else{
         return(
           <>
            <ActualizarDatosConductor conductordatos={conductor} close={()=>setUpdate(false)}/>
           </>
         );
    }
   }else{
    return(
        <span className="text-center text-2xl font-bold mt-20 text-[#4A4E69]">No se pudo cargar la información del conductor</span>
    );
   }
}
