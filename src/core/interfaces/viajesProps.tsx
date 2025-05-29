export interface ViajeItemProps {
  id: number;
  conductor_id: number;
  punto_concentracion: string;
  pmcp_es_origen: boolean;
  ruta: string | null;
  distancia_km: number ;
  tiempo_estimado: number ;
  ganancia_estimada: number ;
 cantidad_pasajeros: number;
  estado: string;
  combinacion_origen_id: number | null;
  created_at: string; // o Date si estás usando objetos Date
  updated_at: string; // o Date si estás usando objetos Date
}
