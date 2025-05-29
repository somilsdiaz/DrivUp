type DatosVehiculoProps={
    modelo_vehiculo:string;
    marca_vehiculo:string;
    color_vehiculo:string;
    año_vehiculo:number;
    capacidad_de_pasajeros:number;
}

export function DatosVehiculo(vehiculo:DatosVehiculoProps){
        if(!vehiculo){
            return(
                <section className="flex flex-col gap-2 bg-">
                    <h1 className="text-2xl font-bold">No se encontró información del vehiculo</h1>
                </section>
            );
        }
        const año = typeof vehiculo.año_vehiculo !== "string" ? (vehiculo.año_vehiculo).toString() : vehiculo.año_vehiculo;

    const vehiculoDataList:{Dato:string, Valor:string}[]=[
        { Dato: "Modelo", Valor: vehiculo.modelo_vehiculo },
        { Dato: "Marca", Valor: vehiculo.marca_vehiculo },
        { Dato: "Color", Valor: vehiculo.color_vehiculo },
        { Dato: "Año", Valor: año },
        { Dato: "Capacidad de pasajeros", Valor: vehiculo.capacidad_de_pasajeros.toString() },
    ]

   return(
    <section className="p-5">
        <h2 className="text-2xl my-2 text-[#4A4E69] font-bold">Datos del vehiculo</h2>
        <ul className="gap-2 flex flex-col">
            {vehiculoDataList.map((vehiculoData, index) => (
                <li key={index} className="flex justify-between p-2 border-b border-gray-300">
                    <span className="text-[#4A4E69] font-bold">{vehiculoData.Dato}:</span>
                    <span >{vehiculoData.Valor}</span>
                </li>
            ))}
        </ul>
    </section>
   );
}