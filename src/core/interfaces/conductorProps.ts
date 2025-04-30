 export type datosConductorProps={
    nombre:string;
    apellido:string;
    apellido2:string;
    calificacion:number;
    fecha:string;
    img:string;
}

export type apiConductorProps = {
    id: number;
    name: string;
    last_name: string;
    second_last_name: string;
    modelo_de_vehiculo: string;
    color_del_vehiculo: string;
    año_del_vehiculo: number;
    capacidad_de_pasajeros: number;
    created_at: string;
    promedio_calificacion: number;
};
