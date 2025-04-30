import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReseñaSubirProps } from '../core/interfaces/ReseñaProps';
import { crearReseña } from '../sevices/reseñasServices';



export const useCrearReseña = (setError:(text:string)=>void) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (reseña: ReseñaSubirProps) => crearReseña(reseña),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reseñas"] });
      },
      onError: (error) => {
         console.error("Error al crear la reseña. ", error);
        setError("Error al crear la reseña. Intenta mas tarde");
      }
    });
  };