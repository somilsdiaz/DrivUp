import { useQuery } from "@tanstack/react-query";
import { getViajesConductor } from "../sevices/listaViajesServices";
import { ViajeItemProps } from "../core/interfaces/viajesProps";
import { getConductorId } from "../sevices/conductoresServices";

type idProps={
    id: number;
}

export const useGetViajesConductor = () => {
    return useQuery<ViajeItemProps[]>({
        queryKey: ["listaViajesConductor"],
        queryFn: async () => {
            const id:idProps=await getConductorId()
            const data:ViajeItemProps[]=await getViajesConductor(id.id)
            return data;
        },
    });
};