import { useQuery } from "@tanstack/react-query";
import { DatosProps } from "../core/interfaces/conductorProps";
import { getConductorById } from "../sevices/conductoresServices";

export const useGetConductorById = (id: number) => {
    return useQuery<DatosProps>({
        queryKey: ["conductor", id],
        queryFn: () => getConductorById(id),
        enabled: !!id, 
    });
};