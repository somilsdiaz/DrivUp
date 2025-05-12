import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import Conductores  from "../../components/vistaPasajeros/detallesConductor/Conductores";
import { useState } from "react";
import { useGetConductores } from "../../hooks/useGetConductor";
import { apiConductorProps } from "../../core/interfaces/conductorProps";
import { useNavigate } from "react-router-dom";



const ListaConductores = () => {
  const navigate=useNavigate();
    const {data:conductores,isLoading,isError}=useGetConductores();

  const [filtroCapacidad, setFiltroCapacidad] = useState<number>(0);

  // Example usage of setConductorSeleccionado to avoid unused variable error
 
  // const [error, setError] = useState<string | null>(null);
  const [orden, setOrden] = useState(""); // para ordenar
  let conductoresFiltrados: apiConductorProps[] = [];
  if(conductores!==undefined){
    conductoresFiltrados = conductores
    .filter((c) =>
      filtroCapacidad > 0 ? c.capacidad_de_pasajeros >= filtroCapacidad : true
    )
    .sort((a, b) => {
      if (orden === "calificacion") return b.promedio_calificacion - a.promedio_calificacion;
      if (orden === "nombre") return a.nombre_completo.localeCompare(b.nombre_completo);
      return 0; // sin orden
    });
  }
    return(
      <HeaderFooterPasajeros>
        
        <section className="p-6 ">
                <h1 className="text-2xl font-bold mb-4">Conductores Disponibles</h1>
                 
                 <section className="flex justify-between items-center">
                <div >
                {/* Filtro por capacidad */}
                <div className="mb-4">
                  <label htmlFor="capacidad-select" className="mr-2 font-semibold">
                    Filtrar por capacidad mínima:
                  </label>
                  <select
                    id="capacidad-select"
                    className="border rounded p-2"
                    value={filtroCapacidad}
                    onChange={(e) => setFiltroCapacidad(Number(e.target.value))}
                  >
                    <option value={0}>Todas</option>
                    <option value={4}>4 o más pasajeros</option>
                    <option value={6}>6 o más pasajeros</option>
                  </select>
                  
                </div>
               
                {/* Ordenar por */}
                <div className="mb-4">
                  <label htmlFor="orden-select" className="mr-2 font-semibold">
                    Ordenar por:
                  </label>
                  <select 
                    id="orden-select"
                    className="border rounded p-2"
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                  >
                    <option value="">Sin orden</option>
                    <option value="calificacion">Calificación</option>
                    <option value="nombre">Nombre</option>
                  </select>
                </div>
                </div>
                {/* Solicatar Ya */}
                <div className="max-[400px]:invisible text-white max-[768px]:text-xs hadow-md bg-gradient-to-r from-[#f7da52] to-[#e9b430] to-90% p-2 rounded-md mb-2 flex flex-col items-center gap-2">
                <h2 className="max-[768px]:text-xs text-2xl text-center font-bold">¿Prefieres que un conductor contacte con contigo?</h2>
                <p className="text-center">Comparte con otros conductores tu preferencias de viaje</p>
                <button
                onClick={() => { navigate("/dashboard/pasajero/preferencias-viajes"); }}
                className="bg-gradient-to-r from-[#e9b430] from-45% to-[#f7da52] shadow-2xl text-white font-bold p-2 px-4 w-3/4 md:w-2/4
                rounded-md cursor-pointer">
                 Solicitar Ya
                  </button>
                
                </div>
                </section>
        
        
                {/* Estado de carga o error */}
                {isLoading ? (
                  <div className="text-center text-gray-500">Cargando conductores...</div>
                ) : isError ? (
                  <div className="text-center text-red-500">Error al cargar los conductores</div>
                ) : conductoresFiltrados.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No hay conductores disponibles para transporte programado en este momento.
                  </div>
                ) : (
                  <Conductores conductoresFiltrados={conductoresFiltrados}/>
                )}
              </section>
    </HeaderFooterPasajeros>
    );
  
};

export default ListaConductores;
