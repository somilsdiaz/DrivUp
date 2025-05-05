import { useState } from "react";
import {  ReseñaSubirProps } from "../../../core/interfaces/ReseñaProps";
import { CalificacionEstrellas } from "./calificacionEstrella";
import { useCrearReseña } from "../../../hooks/useCreateReseña";
import { getUserId } from "../../../utils/auth";

type CrearReseñaProps={
   conductor_id:number;
    enable:boolean;
}
 
 export function CrearReseña({conductor_id,enable}:CrearReseñaProps){
   if(enable){
      const[comentarios, setComentarios] = useState<string>("");
      const [mensaje, setMensaje] = useState<string>("");
      const {mutate:crearReseñas}=useCrearReseña(setMensaje);
     
      const [calificacion, setCalificacion] = useState<number>(0);
  
   async function submit(){
     if(calificacion===0){
        setMensaje("Debes calificar al conductor antes de enviar tu comentario")
        return;
  
     }
  
     if(comentarios.length<30){
        setMensaje("El comentario debe tener al menos 30 caracteres")
        return;
     }
     try {
        const reseña:ReseñaSubirProps={
           conductor_id: conductor_id,
           pasajero_id: Number(getUserId()),
           calificacion: calificacion,
           comentario: comentarios,
        }
        console.log(reseña);
        crearReseñas(reseña);
        setMensaje("Comentario enviado con éxito")
    }catch (error) {
    setMensaje("Error al enviar el comentario. Vuelve a intentarlo más tarde.")
    }
  }
     
       return(
      <section className="flex justify-center py-4 flex-col mx-auto gap-4">
        <CalificacionEstrellas set={setCalificacion} />
        <textarea className="bg-blue-50 border-2 border-gray-950 rounded-md w-full h-30 p-2" 
         name="comentarios" id="comentarios" value={comentarios} 
         onChange={(e)=>setComentarios(e.target.value)} placeholder="Opina acerca del conductor"></textarea>
          {mensaje!=="" ? <span className={`border-2 rounded-md p-2 mx-auto ${mensaje === "Comentario enviado con éxito" ? "border-green-500 bg-green-300 text-green-500" :
           "border-red-500 text-red-500 bg-red-300"
          }`}>{mensaje}</span> : null}
         <button onClick={submit} className="p-2 bg-[#F2B134] w-6/12 mx-auto text-[#4A4E69] font-bold
         rounded-sm cursor-pointer hover:bg-[#F2B134]/90 transition-all transform hover:scale-110 group">Subir comentario</button>
      </section> 
      );
   }
 }
