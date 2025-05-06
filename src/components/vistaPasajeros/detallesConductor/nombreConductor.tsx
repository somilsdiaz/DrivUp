import { datosConductorProps } from "../../../core/interfaces/conductorProps";
import { Estrellas } from "../reseñas/estrellas";



export function NombreConductor(conductor:datosConductorProps){ 
    return(
        <section className="flex flex-col gap-2 bg-[#2D5DA1] text-white p-4 w-full">
            <div className="flex gap-2 items-center justify-between">
            <img className="w-24 h-24 rounded-full object-cover border-2 border-white" src={conductor.img} alt="Foto del conductor" />
            <h1 className="text-2xl font-bold">{conductor.nombre_completo}</h1>
            </div>
            <Estrellas calificacion={conductor.calificacion}/>
            <span className="text-sm text-gray-300">Miembro desde: {new Date(conductor.fecha).toLocaleDateString()}</span>
        </section>
    );
}