import { useQuery } from "@tanstack/react-query";
import { ReseñaProps } from "../core/interfaces/ReseñaProps";
import { traerReseñas } from "../sevices/reseñasServices";

export const useGetReseñas = (conductor_Id:string) => {
    return useQuery<ReseñaProps[]>({
        queryKey: ["reseñas", conductor_Id],
        queryFn: () => traerReseñas(conductor_Id),
    });
};