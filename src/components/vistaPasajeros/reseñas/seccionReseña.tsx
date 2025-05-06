import { useEffect, useState } from "react";
import { CrearReseña } from "./crearReseñas";
import { Reseña } from "./reseña";
import { ReseñaProps } from "../../../core/interfaces/ReseñaProps";
import { useGetReseñas } from "../../../hooks/useGetReseñas";
import { getUserId } from "../../../utils/auth";



export  function SeccionReseña({ conductor_id }: { conductor_id: number }){
    const {data:reseñas}=useGetReseñas(conductor_id.toString());
    const [habilitado, sethabilitado] = useState<boolean>(true);
    useEffect(() => {
        if (reseñas && reseñas.some((a: ReseñaProps) => a.id === Number(getUserId()))) {
            sethabilitado(false);
        }else{
            sethabilitado(true);
        }
    }, [reseñas]);
   
    
    
    
return (
    <section className="p-5">
        <h2 className="text-[#4A4E69] text-2xl font-bold mb-4">Comentarios y calificación</h2>
        {!habilitado&&(
            <div className="flex w-full justify-center">
                <span className="text-lg bg-blue-50 border mx-auto p-1 my-2 border-blue-200 text-blue-400 rounded-md">Ya calificastes a este conductor</span>
            </div>
        ) }
        <CrearReseña conductor_id={conductor_id} enable={habilitado} />
        <section className="flex flex-col gap-4 mt-4">
        {reseñas && (reseñas.length>0?(reseñas.map((element: ReseñaProps, index: number) => (
            <Reseña key={index} {...element} />
        ))):<span className="text-center text-[#4A4E69]">Este conductor no tiene reseñas.</span>)}
        </section>
      
    </section>
);
}