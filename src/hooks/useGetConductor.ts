import { useQuery } from "@tanstack/react-query";
import { apiConductorProps } from "../core/interfaces/conductorProps";
import { getConductores } from "../sevices/conductoresServices";

export const useGetConductores = () => {
    return useQuery<[apiConductorProps]>({
        queryKey: ["conductor"],
        queryFn: () => getConductores(),
    });
};