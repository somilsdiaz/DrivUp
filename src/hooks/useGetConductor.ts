import { useQuery } from "@tanstack/react-query";
import { apiConductorProps } from "../core/interfaces/conductorProps";
import { getConductor } from "../sevices/conductoresServices";

export const useGetConductor = (conductor_Id:string) => {
    return useQuery<[apiConductorProps]>({
        queryKey: ["conductor", conductor_Id],
        queryFn: () => getConductor(conductor_Id),
    });
};