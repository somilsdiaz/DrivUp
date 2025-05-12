import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearRutaUsuario } from '../sevices/rutaUsuarioServices';
import { rutaUsuarioProps } from '../core/interfaces/rutaUsuarioProps';



export const useCrearRutaUsuario = (setError:(text:string)=>void) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (ruta: rutaUsuarioProps) => crearRutaUsuario(ruta),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rutas"] });
      },
      onError: (error) => {
         console.error("Error al crear la ruta. ", error);
        setError("Error al crear la ruta. Intenta mas tarde");
      }
    });
  };