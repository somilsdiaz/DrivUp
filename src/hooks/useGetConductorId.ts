import { useQuery } from "@tanstack/react-query";
import { getConductorId } from "../sevices/conductoresServices";

type idProps={
    id: number;
}
export const useGetConductorId = (id: number) => {
    return useQuery<idProps>({
        queryKey: ["conductorId", id],
        queryFn: () => getConductorId(),
        enabled: !!id, 
    });
};