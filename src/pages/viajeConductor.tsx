
import { ViajeConductor } from "../components/listaViajes/viajeConductor";
import { useGetViajesConductor } from "../hooks/useGetViajesConductor";
import HeaderFooterConductores from "../layouts/headerFooterConductores";


export function ViajesConductor(){
 
    const { data: viajes, isLoading, error } = useGetViajesConductor();
    if(isLoading) return <div>Cargando...</div>;
    if( error || viajes === undefined ){
        return <div>Error al cargar los viajes</div>;
    }
    return(
        <HeaderFooterConductores>
        <section className="p-4">
            <h1 className="text-2xl font-bold text-[#244b85] mb-5">Tu listado de viajes</h1>
           <section className="flex flex-col gap-4">
             {viajes.map((viaje,index) => (
               <ViajeConductor {...viaje} key={index}/>
            ))}
           </section>
        </section>
       </HeaderFooterConductores>
    );
}