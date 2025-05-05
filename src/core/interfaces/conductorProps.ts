 export type datosConductorProps={
    nombre_completo:string;
    calificacion:number;
    fecha:string;
    img:string;
}

export type apiConductorProps = {
    id: number;
    nombre_completo: string;
    marca_de_vehiculo: string;
    modelo_de_vehiculo: string;
    foto_de_perfil: string;
    color_del_vehiculo: string;
    año_del_vehiculo: number;
    capacidad_de_pasajeros: number;
    created_at: string;
    origen:string;
    destino:string;
    descripcion: string;
    promedio_calificacion: number;
};

export type Conductor = {
  id: number;
  nombre_completo: string;
  user_id: number;
  foto_de_perfil: string
  promedio_calificacion: number;
  color_vehiculo: string;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  año_vehiculo: number;
  capacidad_de_pasajeros: number;
  created_at: string;
  origen_aproximado: string;
  destino_aproximado: string;
};