import { apiConductorProps, datosConductorProps } from "../../../core/interfaces/conductorProps"
import { SeccionReseña } from "../reseñas/seccionReseña";
import { DatosVehiculo } from "./datosVehiculo";
import { NombreConductor } from "./nombreConductor";
import { DatosRuta } from "./datosRuta";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usehandleContactClick } from "../../../hooks/handleContactClick";


export function DetallesConductor(conductor:apiConductorProps|undefined){
    const [windowWidth, setWindow] = useState(window.innerWidth);
    const nav=useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [error,setError]=useState<string>("");
    const handleContactClick=usehandleContactClick();

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, [conductor]);

    useEffect(() => {
      window.scrollTo(0, 0);
      const handleResize = () => setWindow(window.innerWidth);
      window.addEventListener("resize", handleResize);
      handleResize(); // Set initial width
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    if(conductor){
        const conductorHeaderProps:datosConductorProps={
            nombre_completo:conductor.nombre_completo,
            calificacion:Math.round(conductor.promedio_calificacion),
            fecha:conductor.created_at,
            img:`https://drivup-backend.onrender.com/uploads/${conductor.foto_de_perfil}`,
        }
        const conductorVehiculoProps={
            modelo_vehiculo:conductor.modelo_de_vehiculo,
            marca_vehiculo:conductor.marca_de_vehiculo,
            color_vehiculo:conductor.color_del_vehiculo,
            año_vehiculo:conductor.año_del_vehiculo,
            capacidad_de_pasajeros:conductor.capacidad_de_pasajeros,
        } 
        const datosRutasProps={
            origen:conductor.origen,
            destino:conductor.destino,
            descripcion:conductor.descripcion
        }
        return(
            <section ref={containerRef} className="flex flex-col rounded-md border shadow-md  w-5/9 mx-auto max-[1080px]:w-11/12 max-[1080px]:mt-4 overflow-y-scroll max-h-[80vh]">
              <NombreConductor {...conductorHeaderProps}/>
              <div className="bg-amber-300 border-b-2 border-[#2D5DA1] h-2 w-full p-0.5"></div>
              <DatosVehiculo {...conductorVehiculoProps}/>
              <DatosRuta {...datosRutasProps} />
              
              <div className="flex justify-center">
              {1080>windowWidth&&(
                <button
                onClick={()=>(nav("/dashboard/pasajero/lista-conductores"))} 
                className="mx-auto my-4 max-[1080px]:w-5/12 w-6/12 cursor-pointer bg-blue-700 text-white font-bold px-4 py-2 rounded
                hover:bg-blue-700/90 transition-all transform hover:scale-110 group">
                      Retornar
                  </button>
              )}
              <button 
              onClick={()=>{handleContactClick({driverId:Number(conductor.user_id),setError:setError,navigate:nav})}}
              className="mx-auto my-4 max-[1080px]:w-5/12 w-6/12 cursor-pointer bg-[#F2B134] text-[#2D5DA1] font-bold px-4 py-2 rounded
              hover:bg-[#F2B134]/90 transition-all transform hover:scale-110 group">
                    Contactar
                </button>
                {error!==""&&(<span className="self-end mt-4 mx-auto text-xs p-1 text-red-600 border border-red-600 bg-red-300 ">{error}</span> )}
              </div>
              <SeccionReseña conductor_id={conductor.id} />
            </section>
              
          
        );
    }

    return(
        <section className="flex flex-col gap-2 bg-">
            <h1 className="text-2xl font-bold">No se encontró información del conductor</h1>
        </section>
    );
    

}