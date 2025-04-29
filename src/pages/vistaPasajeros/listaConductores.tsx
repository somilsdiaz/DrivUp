import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Simulamos el tipo de datos de un conductor
type Conductor = {
  id: number;
  nombre: string;
  fotoPerfil: string;
  calificacion: number;
  capacidadVehiculo: number;
  fechaIngreso: string;
  origen: string;
  destino: string;
};

const ListaConductores = () => {
  const [loading, setLoading] = useState(true);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [filtroCapacidad, setFiltroCapacidad] = useState<number>(0);

  useEffect(() => {
    // Simular fetch de datos
    setTimeout(() => {
      const datosSimulados: Conductor[] = [
        {
          id: 1,
          nombre: "Juan Pérez",
          fotoPerfil: "https://randomuser.me/api/portraits/men/32.jpg",
          calificacion: 4.5,
          capacidadVehiculo: 4,
          fechaIngreso: "2020-06-15",
          origen: "Bogotá",
          destino: "Medellín",
        },
        {
          id: 2,
          nombre: "María Rodríguez",
          fotoPerfil: "https://randomuser.me/api/portraits/women/45.jpg",
          calificacion: 4.8,
          capacidadVehiculo: 6,
          fechaIngreso: "2019-04-10",
          origen: "Cali",
          destino: "Barranquilla",
        },
        // Puedes agregar más
      ];
      setConductores(datosSimulados);
      setLoading(false);
    }, 1500); // Simula 1.5s de carga
  }, []);

  // Filtrado de capacidad
  const conductoresFiltrados = filtroCapacidad
    ? conductores.filter((c) => c.capacidadVehiculo >= filtroCapacidad)
    : conductores;

  return (
    <HeaderFooterPasajeros>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Conductores Disponibles</h1>

        {/* Filtros */}
        <div className="mb-4">
          <label className="mr-2 font-semibold">Filtrar por capacidad mínima:</label>
          <select
            className="border rounded p-2"
            value={filtroCapacidad}
            onChange={(e) => setFiltroCapacidad(Number(e.target.value))}
          >
            <option value={0}>Todas</option>
            <option value={4}>4 Pasajeros o más</option>
            <option value={6}>6 Pasajeros o más</option>
          </select>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-500">Cargando conductores...</div>
        ) : (
          <>
            {/* Sin conductores */}
            {conductoresFiltrados.length === 0 ? (
              <div className="text-center text-gray-500">
                No hay conductores disponibles para transporte programado en este momento.
              </div>
            ) : (
              <div className="grid gap-4">
                {conductoresFiltrados.map((conductor) => (
                  <div key={conductor.id} className="border p-4 rounded shadow-md flex flex-col md:flex-row items-center">
                    {/* Imagen */}
                    <img
                      src={conductor.fotoPerfil}
                      alt={conductor.nombre}
                      className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                    />

                    {/* Información */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{conductor.nombre}</h2>

                      {/* Calificación */}
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-yellow-400 ${i < Math.floor(conductor.calificacion) ? "fill-current" : ""}`}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-gray-600">{conductor.calificacion.toFixed(1)}</span>
                      </div>

                      {/* Datos adicionales */}
                      <p className="text-gray-600">Capacidad: {conductor.capacidadVehiculo} pasajeros</p>
                      <p className="text-gray-600">Miembro desde: {new Date(conductor.fechaIngreso).toLocaleDateString("es-ES", { year: 'numeric', month: 'long' })}</p>
                      <p className="text-gray-600">Origen: {conductor.origen}</p>
                      <p className="text-gray-600">Destino: {conductor.destino}</p>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                      <Link to={`/conductores/${conductor.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">
                        Ver Detalles
                      </Link>
                      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Contactar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </HeaderFooterPasajeros>
  );
};

export default ListaConductores;
