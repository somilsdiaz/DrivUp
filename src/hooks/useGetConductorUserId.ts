import { useQuery } from "@tanstack/react-query";
import {  getConductorById, getConductorUsedId } from "../sevices/conductoresServices";
import { DatosProps } from "../core/interfaces/conductorProps";

type idProps={
    user_id: number;
}
export const useGetConductorUserId = (id: number) => {
    return useQuery<DatosProps>({
        queryKey: ["conductorUserId", id],
        queryFn: async () => {
            const data: idProps = await getConductorUsedId(id);
            const data2: DatosProps = await getConductorById(data.user_id);
            if (!data2) throw new Error("No se encontró el conductor para el id proporcionado");
            return data2;
        },
        enabled: !!id, 
    });
};