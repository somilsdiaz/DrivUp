import { useQuery } from "@tanstack/react-query";
import { getViajesPasajero } from "../sevices/listaViajesServices";
import { ViajeItemProps } from "../core/interfaces/viajesProps";

export const useGetViajesPasajero = (id: number) => {
    return useQuery<ViajeItemProps[]>({
        queryKey: ["listaViajesPasajero", id],
        queryFn: () => getViajesPasajero(id),
        enabled: !!id, 
    });
};