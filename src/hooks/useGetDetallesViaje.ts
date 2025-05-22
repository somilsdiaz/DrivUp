import { useQuery } from "@tanstack/react-query";
import { traerDetallesViaje } from "../sevices/detallesViajes";
import { ViajePasajeroData } from "../core/interfaces/detallesViajesProps";


export const useGetDetallesViaje = (viaje_id:number) => {
    return useQuery<[ViajePasajeroData]>({
        queryKey: ["viajes", viaje_id],
        queryFn: () => traerDetallesViaje(viaje_id),
    });
};