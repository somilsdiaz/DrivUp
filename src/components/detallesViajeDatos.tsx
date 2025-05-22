// import redMarket from "../assets/Pointer_Rojo.png";
// import blueMarket from "../assets/Pointer_Azul.png";
// import greenMarket from "../assets/Pointer_Verde.png";

import { useGetDetallesViaje } from "../hooks/useGetDetallesViaje";

export type viajesProps={
    id:number
}


export function DetallesViajeDatos({id}:viajesProps) {
   
    const { data, isLoading, isError } = useGetDetallesViaje(6);
    return (
        <section className="min-[600px]:w-3/12 p-2 overflow-y-scroll max-h-[95vh]">
            <h1 className="text-3xl text-center text-[#4A4E69] font-bold mb-4">Detalles de viaje</h1>
            <div className="w-full border border-gray-500 bg-gray-500"></div>
            <h2 className="text-xl mt-5  text-[#4A4E69] font-bold mb-4">Ubicaciones</h2>
            <section className="flex flex-col gap-5">
                <div className="flex gap-2 items-center"><img className="size-1/6" src={redMarket} alt="Apuntador conductor" /><span>{data.conductor}</span></div>   
                <div className="flex flex-col gap-2">
                     {data.pasajeros.map((pasajero,index)=>(
                    <div className="flex gap-2 items-center" key={index}><img className="size-1/6" src={blueMarket} alt="Apuntador pasajero" /><span>{pasajero}</span></div>   
                ))}
                </div>
                 <div>
                    {data.destinos.map((destino,index)=>(
                    <div className="flex gap-2 items-center" key={index}><img className="size-1/6"src={greenMarket} alt="Apuntador pasajero" /><span>{destino}</span></div>   
                ))}
                 </div>
            </section>

        </section>
    )
}