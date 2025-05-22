
import { useNavigate } from "react-router-dom";
import { viajeProps } from "../core/interfaces/detallesViajesProps";
import { useGetDetallesViaje } from "../hooks/useGetDetallesViaje";
import {User,Circle, ArrowLeft} from "lucide-react";



export function DetallesViajeDatos({id,punto_concentracion}:viajeProps) {
   
    const { data:viajes, isLoading, isError } = useGetDetallesViaje(id);
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (isError||!viajes) {
        return <div>Error al cargar los datos</div>;
    }

    const data = viajes;
    let usuarios = [];
    if (data[0].pmcp_es_origen) {
        usuarios = [...(data || [])].sort((a, b) => a.orden_entrega - b.orden_entrega);
    } else {
        usuarios = [...(data || [])].sort((a, b) => a.orden_recogida - b.orden_recogida);
    }
    return (
        <section className="min-[600px]:w-3/12 p-2 overflow-y-scroll max-h-[95vh]">
            <h1 className="text-3xl text-center text-[#4A4E69] font-bold mb-4">Detalles de viaje</h1>
            <div className="w-full border border-gray-500 bg-gray-500"></div>
            <h2 className="text-xl mt-5  text-[#4A4E69] font-bold mb-4">Punto de concentracion</h2>
            <div className="flex gap-2">
                 <Circle className="text-[#4A4E69] fill-[#4A4E69]"/>
                <h3>{punto_concentracion}<span>{data[0].pmcp_es_origen ? ' (origen)' : ' (destino)'}</span> </h3></div>
           <h2 className="text-xl mt-5  text-[#4A4E69] font-bold mb-4">Pasajeros (orden)</h2>
            <section className="flex flex-col gap-5">
               {usuarios.map((usuario, index) => (
                    <div key={index} className="flex gap-2">
                        <User className="text-[#4A4E69] fill-[#4A4E69]"/>
                        <h3>{usuario.full_name} </h3>
                    </div>
                ))}
            </section>
            <button className="p-2 bg-[#F2B134] w-6/12 mx-auto text-[#4A4E69] font-bold cursor-pointer
                               rounded-sm flex justify-center gap-2 mt-5 hover:bg-[#F2B134]/90 transition-all transform hover:scale-110 group"
            onClick={() => navigate('/dashboard/conductor/lista-viajes')}>
               <ArrowLeft /> Volver
            </button>

        </section>
    )
}