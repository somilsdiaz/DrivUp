export interface ReseñaProps {
    id:number;
    name:string;
    last_name:string;
    id_reseña:number;
    calificacion:number;
    comentarios:string;
    creado_en:string;
}

export interface ReseñaSubirProps{
    conductor_id:number;
    pasajero_id:number;
    calificacion:number;
    comentario:string;
}

