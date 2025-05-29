type datosRutaProps={
   origen:string;
   destino:string;
   descripcion:string;
}

export function DatosRuta(ruta:datosRutaProps){
    return(
       <section className="p-5">
         <h2 className="text-2xl my-2 text-[#4A4E69] font-bold">Datos de la ruta</h2>
         <div className="flex gap-4 justify-between mb-2 flex-wrap">
                <span className="flex gap-2"><strong className="text-[#4A4E69] ">Origen aproximado:</strong>{ruta.origen}</span>
                <span className="flex gap-2"><strong className="text-[#4A4E69] ">Destino aproximado:</strong>{ruta.destino}</span>
        </div>
        <span className="my-3 text-[#4A4E69] font-bold">Descripcion:</span>
            <p className="w-full bg-blue-50 p-2">
                {ruta.descripcion}
            </p>
        

       </section>
    );
}