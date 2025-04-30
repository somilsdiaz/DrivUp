import { datosConductorProps } from "../../../core/interfaces/conductorProps";
import { Estrellas } from "../reseñas/estrellas";



export function NombreConductor(conductor:datosConductorProps){ 
    return(
        <section className="flex flex-col gap-2 bg-">
            <img src={conductor.img} alt="Foto del conductor" />
            <h1 className="text-2xl font-bold">{conductor.nombre} {conductor.apellido} {conductor.apellido2}</h1>
            <Estrellas calificacion={conductor.calificacion}/>
            <span className="text-sm text-gray-500">Miembro desde: {conductor.fecha}</span>
        </section>
    );
}