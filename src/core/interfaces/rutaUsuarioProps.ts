export interface sendRutaUsuarioProps {
  user_id: number;
  origen: string;
  destino: string;
  dias: string[];
  hora: string;
  minutos:string;
  jornada:string;
  descripcion: string;
}


export interface rutaUsuarioProps {
  id?: number;
   user_id: number;
   origen: string;
  destino: string;
  dias: string;
  hora: string;
  descripcion: string;
}