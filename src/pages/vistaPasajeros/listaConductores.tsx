import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Tipo basado en estructura esperada del backend
type Conductor = {
  id: number;
  nombre_completo: string;
  user_id: number;
  foto_de_perfil: string
  calificacion_promedio: number;
  capacidad_de_pasajeros: number;
  created_at: string;
  origen_aproximado: string;
  destino_aproximado: string;
};

type Usuario = {
  id: number;
  name: string;
  second_name: string;
  last_name: string;
  second_last_name: string;


};

const ListaConductores = () => {
  const [loading, setLoading] = useState(true);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [filtroCapacidad, setFiltroCapacidad] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [orden, setOrden] = useState(""); // para ordenar

  useEffect(() => {
    const fetchConductoresConUsuarios = async () => {
      try {
        const resConductores = await fetch("https://drivup-backend.onrender.com/conductores");
        if (!resConductores.ok) throw new Error("Error al cargar conductores");

        const dataConductores = await resConductores.json();

        // Para cada conductor, obtener el usuario y construir el nombre_completo
        const conductoresConNombre = await Promise.all(
          dataConductores.map(async (conductor: Conductor) => {
            try {
              const resUsuario = await fetch(`https://drivup-backend.onrender.com/usuario/${conductor.user_id}`);
              if (!resUsuario.ok) throw new Error();

              const usuario: Usuario = await resUsuario.json();

              const nombre_completo = `${usuario.name} ${usuario.second_name} ${usuario.last_name} ${usuario.second_last_name}`.trim();

              return {
                ...conductor,
                nombre_completo
              };
            } catch {
              return {
                ...conductor,
                nombre_completo: "Nombre no disponible"
              };
            }
          })
        );

        setConductores(conductoresConNombre);
      } catch (err) {
        setError("No se pudo cargar la lista de conductores. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchConductoresConUsuarios();
  }, []);

  //Filtros
  const conductoresFiltrados = conductores
    .filter((c) =>
      filtroCapacidad > 0 ? c.capacidad_de_pasajeros >= filtroCapacidad : true
    )
    .sort((a, b) => {
      if (orden === "calificacion") return b.calificacion_promedio - a.calificacion_promedio;
      if (orden === "nombre") return a.nombre_completo.localeCompare(b.nombre_completo);
      return 0; // sin orden
    });

  return (
    <HeaderFooterPasajeros>
      <div className="p-6">
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
        {loading ? (
          <div className="text-center text-gray-500">Cargando conductores...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : conductoresFiltrados.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay conductores disponibles para transporte programado en este momento.
          </div>
        ) : (
          <div className="grid gap-4">
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
                    {Array.from({ length: 5 }).map((_, i) => (
                      // <span key={i} className={`text-yellow-400 ${i < Math.floor(conductor.calificacion) ? "fill-current" : ""}`}>
                      <span key={i} className={`text-yellow-400 fill-current: ""}`}>
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-600">
                      {/* {conductor.calificacion?.toFixed(1) ?? "N/A"} */}
                      {"N/A"}
                    </span>
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
                  <p className="text-gray-600">Origen: {conductor.origen_aproximado ? conductor.origen_aproximado : "Información no disponible"}</p>
                  <p className="text-gray-600">Destino: {conductor.destino_aproximado ? conductor.destino_aproximado : "Información no disponible"}</p>
                </div>

                <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                  <Link
                    to={`/conductores/${conductor.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
                  >
                    Ver Detalles
                  </Link>
                  <button className="bg-[#5AAA95] text-white px-4 py-2 rounded hover:bg-green-600">
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HeaderFooterPasajeros>
  );
};

export default ListaConductores;
