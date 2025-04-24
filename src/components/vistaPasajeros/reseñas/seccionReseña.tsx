import { useEffect, useState } from "react";
import { CrearReseña } from "./crearReseñas";
import { Reseña } from "./reseña";
import { ReseñaProps } from "../../../core/interfaces/ReseñaProps";



export  function SeccionReseña(){
    const [reseñas, setReseñas] = useState<ReseñaProps[]>([]);
    async function fetchReseñas() {  
        try {
            const response = await fetch("http://localhost:5000/traerResenas?conductor_id=4", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al traer las reseñas:", error);
        }
    }
    
useEffect(() => {
    async function loadReseñas() {
        const data = await fetchReseñas();
        if (data) {
            setReseñas(data);
        }
    }
    loadReseñas();
}, []);

return (
    <section className="p-5">
        <h2 className="text-[#4A4E69] text-2xl font-bold">Comentarios y calificación</h2>
        
        <CrearReseña conductor_id={4} pasajero_id={36} />
        <section className="flex flex-col gap-4 mt-4">
        {reseñas.length>0?(reseñas.map((element: ReseñaProps, index: number) => (
            <Reseña key={index} {...element} />
        ))):<span className="text-center text-[#4A4E69]">Este conductor no tiene reseñas.</span>}
        </section>
      
    </section>
);
}