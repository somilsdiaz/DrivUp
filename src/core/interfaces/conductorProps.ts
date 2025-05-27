 export type datosConductorProps={
    nombre_completo:string;
    calificacion:number;
    fecha:string;
    img:string;
}

export type apiConductorProps = {
    id: number;
    user_id:number;
    nombre_completo: string;
    marca_de_vehiculo: string;
    modelo_de_vehiculo: string;
    foto_de_perfil: string;
    color_del_vehiculo: string;
    año_del_vehiculo: number;
    capacidad_de_pasajeros: number;
    created_at: string;
    origen_aproximado:string;
    destino_aproximado:string;
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

export interface DatosProps {
  id: number;
  user_id: number;
  licencia_de_conducir: string;
  fecha_de_vencimiento: string; 
  foto_de_perfil: string;
  marca_de_vehiculo: string;
  modelo_de_vehiculo: string;
  año_del_vehiculo: number;
  color_del_vehiculo: string;
  placa_del_vehiculo: string;
  capacidad_de_pasajeros: number;
  tarjeta_de_propiedad_vehicular: string;
  seguro_del_vehiculo: string;
  foto_de_licencia: string;
  created_at: string; 
  origen_aproximado: string;
  destino_aproximado: string;
  descripcion: string;
}

export interface DatosUpdateProps {
  user_id: number;
  marca_de_vehiculo?: string;
  modelo_de_vehiculo?: string;
  año_del_vehiculo?: number;
  color_del_vehiculo?: string;
  placa_del_vehiculo?: string;
  capacidad_de_pasajeros?: number;
  origen_aproximado?: string;
  destino_aproximado?: string;
  descripcion?: string;
}
