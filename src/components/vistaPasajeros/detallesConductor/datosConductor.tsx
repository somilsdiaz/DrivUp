import { useEffect, useState } from "react";
import { useGetConductor } from "../../../hooks/useGetConductor";
import { datosConductorProps } from "../../../core/interfaces/conductorProps";
import { NombreConductor } from "./nombreConductor";

export function datosConductor(id:string){
    const {refetch}=useGetConductor(id);
    const [datosConductor,setDatosConductor]=useState<datosConductorProps>();
    useEffect(()=>{
       const response=refetch();
       response.then((result) => {
            if(result.data){
                const data:datosConductorProps={
                    nombre:result.data[0].nombre,
                    apellido:result.data[0].apellido,
                    calificacion:result.data[0].calificacion,
                    foto:result.data[0].foto,
                    vehiculo:result.data[0].vehiculo,
                    placa:result.data[0].placa,
                    descripcion:result.data[0].descripcion,
             }
            }
       })
    },[id]);

    return(
        <section>
            <NombreConductor conductorProps={datosConductor}/>
        </section>
    );
}