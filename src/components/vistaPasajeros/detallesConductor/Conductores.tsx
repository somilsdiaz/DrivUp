import { useEffect, useState } from "react";
import { apiConductorProps } from "../../../core/interfaces/conductorProps";
import { useGetConductores } from "../../../hooks/useGetConductor";
import { Estrellas } from "../reseñas/estrellas";
import { DetallesConductor } from "./detallesConductor";
import { Link } from "react-router-dom";



const Conductores = () => {
  const {data:conductores,isLoading,isError}=useGetConductores();
const [conductorSeleccionado, setConductorSeleccionado] = useState<apiConductorProps | undefined>(conductores?.[0]);

const [windowWidth, setWindow] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setWindow(window.innerWidth);
  window.addEventListener("resize", handleResize);
  handleResize(); // Set initial width
  return () => window.removeEventListener("resize", handleResize);
}, []);

// Example usage of setConductorSeleccionado to avoid unused variable error
  const [filtroCapacidad, setFiltroCapacidad] = useState<number>(0);
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

 

  return (
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
          <div className="flex gap-4">
            <section className="max-[1080px]:w-full grid gap-4 overflow-y-auto max-h-[80vh] w-4/9 border rounded-md">
            {conductoresFiltrados.map((conductor) => (
              <div
                key={conductor.id}
                className="border p-4 rounded shadow-md flex flex-col md:flex-row items-center"
              >
                <img
                  src={`https://drivup-backend.onrender.com/uploads/${conductor.foto_de_perfil}`}
                  alt={conductor.nombre_completo}
                  className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold">{conductor.nombre_completo}</h2>

                  <div className="flex items-center mt-1">
                    <Estrellas calificacion={Math.round(conductor.promedio_calificacion)}/>
                  </div>
                  <p className="text-gray-600"> Nombre: {conductor.nombre_completo}</p>
                  <p className="text-gray-600">Capacidad: {conductor.capacidad_de_pasajeros} pasajeros</p>
                  <p className="text-gray-600">
                    Miembro desde:{" "}
                    {new Date(conductor.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-gray-600">Origen: {conductor.origen ? conductor.origen : "Información no disponible"}</p>
                  <p className="text-gray-600">Destino: {conductor.destino ? conductor.destino : "Información no disponible"}</p>
                </div>

                <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                  {1080<windowWidth?(
                    <button
                    onClick={() => setConductorSeleccionado(conductor)}
                     className="cursor-pointer bg-[#2D5DA1] blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
                   >
                     Ver Detalles
                   </button>
                  ):(
                    <button
                   onClick={() => setConductorSeleccionado(conductor)}
                    className="cursor-pointer bg-[#2D5DA1] blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
                  >
                   <Link to="/dashboard/conductor/solicitudes/detallesConductor" state={conductor}>Ver Detalles</Link>
                  </button>
                  )}
                  <button className="cursor-pointer bg-[#F2B134] text-[#2D5DA1] font-bold px-4 py-2 rounded hover:bg-yellow-500">
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </section>
          {windowWidth>1080&&(
            <section className="flex flex-col rounded-md border shadow-md  w-5/9 overflow-y-auto max-h-[80vh]">
            {conductorSeleccionado ? (<DetallesConductor {...conductorSeleccionado}/>) :
             (<span className="flex justify-center p-2 text-2xl font-bold">No se encontró información del conductor</span>)}
            </section>
          )}
          </div>
        )}
      </section>
  );
};

export default Conductores;