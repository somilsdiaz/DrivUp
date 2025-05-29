import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatosUpdateProps } from "../core/interfaces/conductorProps";
import { updateDatos } from "../sevices/conductoresServices";

export const usePatchConductor = (setError:(text:string)=>void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DatosUpdateProps) => updateDatos(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conductores"] });
        },
         onError: () => {
        setError("Error al crear la ruta. Intenta mas tarde");
      }
    });
};



