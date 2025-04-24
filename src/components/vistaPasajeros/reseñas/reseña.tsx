import { ReseñaProps } from "../../../core/interfaces/ReseñaProps";
import { Estrellas } from "./estrellas";

export function Reseña(reseña:ReseñaProps){
   return(
    <div className="text-white rounded-md flex flex-col gap-2 border-2 border-[#2D5DA1] p-4 bg-[#2D5DA1]">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">{`${reseña.name} ${reseña.last_name[0]}`}</h3>
        <span>{new Date(reseña.creado_en).toLocaleDateString('es-CO')}</span>
        </div>
        <Estrellas calificacion={reseña.calificacion}/>
        <p>{reseña.comentario}</p>
    </div>
   );
}