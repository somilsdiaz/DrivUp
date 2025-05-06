import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import Conductores  from "../../components/vistaPasajeros/detallesConductor/Conductores";
import { useState } from "react";
import { useGetConductores } from "../../hooks/useGetConductor";
import { apiConductorProps } from "../../core/interfaces/conductorProps";



const ListaConductores = () => {
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
                    <option value="calificacion">Calificación (No disponible aun)</option>
                    <option value="nombre">Nombre</option>
                  </select>
                </div>
        
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
