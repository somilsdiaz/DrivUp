
import { useRef } from "react";
import { DatosVehiculo } from "../vistaPasajeros/detallesConductor/datosVehiculo";
import { DatosRuta } from "../vistaPasajeros/detallesConductor/datosRuta";
import { DatosProps } from "../../core/interfaces/conductorProps";


export function DetalleConductorModal(conductor:DatosProps|undefined){
    const containerRef = useRef<HTMLDivElement>(null);


    if(conductor){
        
        const conductorVehiculoProps={
            modelo_vehiculo:conductor.modelo_de_vehiculo,
            marca_vehiculo:conductor.marca_de_vehiculo,
            color_vehiculo:conductor.color_del_vehiculo,
            año_vehiculo:conductor.año_del_vehiculo,
            capacidad_de_pasajeros:conductor.capacidad_de_pasajeros,
        } 
        const datosRutasProps={
            origen:conductor.origen_aproximado,
            destino:conductor.destino_aproximado,
            descripcion:conductor.descripcion
        }
        return(
            <section ref={containerRef} className="flex flex-col rounded-md border shadow-md  w-full mx-auto max-[1080px]:w-11/12 max-[1080px]:mt-4 overflow-y-scroll max-h-[80vh]">
              <div className="p-4 bg-[#2D5DA1]">
                <h1 className="Text-2xl md:text-3xl font-bold mb-2 text-center text-white ">{conductor.nombre_completo}</h1>
                <span className="text-sm text-gray-300">Miembro desde: {new Date(conductor.created_at).toLocaleDateString()}</span>
              </div>

              <div className="bg-amber-300 border-b-2 border-[#2D5DA1] h-2 w-full p-0.5"></div>
              <DatosVehiculo {...conductorVehiculoProps}/>
              <DatosRuta {...datosRutasProps} />
              
              <div className="flex justify-center">

            
              </div>
            </section>
              
          
        );
    }

    return(
        <section className="flex flex-col gap-2 bg-">
            <h1 className="text-2xl font-bold">No se encontró información del conductor</h1>
        </section>
    );
    

}