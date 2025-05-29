import { ViajePasajero } from "../components/listaViajes/viajePasajero";
import { useGetViajesPasajero } from "../hooks/useGetViajesPasajero";
import HeaderFooterPasajeros from "../layouts/headerFooterPasajeros";
import { getUserId } from "../utils/auth";

export function ViajesPasajero() {


 const {data:viajes,isLoading,error}=useGetViajesPasajero(Number(getUserId()));
    if(isLoading) return <div>Cargando...</div>;
    if( error || viajes === undefined){
        return <div>Error al cargar los viajes</div>;
    }
    return(
        <HeaderFooterPasajeros>
        <section className="p-4">
            <h1 className="text-2xl font-bold text-[#244b85] mb-5">Tu listado de viajes</h1>
           <section className="flex flex-col gap-4">
             {viajes.length > 0 ? (
                viajes.map((viaje: any, index: number) => (
                  <ViajePasajero {...viaje} key={index}/>
                ))
             ) : (
                <div className="mx-auto mt-20"><span className="text-center text-3xl text-blue-600/30">Aun no tienes viajes asignados</span></div>
             )}
           </section>
        </section>
       </HeaderFooterPasajeros>
    );
}