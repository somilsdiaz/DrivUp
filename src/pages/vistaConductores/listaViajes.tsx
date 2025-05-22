import { useEffect, useState } from "react";
import { FaClock, FaRoad, FaDollarSign, FaUsers } from "react-icons/fa";
import HeaderFooterConductores from "../../layouts/headerFooterConductores";
import { getUserId } from "../../utils/auth";

type Viaje = {
  id: number;
  punto_concentracion: string;
  tiempo_estimado: string;
  distancia_km: number;
  ganancia_estimada: number;
  cantidad_pasajeros: number;
};

type ConductorEstado = {
  success: boolean;
  activo: boolean;
  message: string;
  data: {
    conductorId: number;
    estadoDisponibilidad?: string;
    ubicacion?: {
      latitud: string;
      longitud: string;
    };
    ultimaActualizacion?: string;
    sesionExpiraEn?: string;
  };
};

const ListaViajes = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [conductorActivo, setConductorActivo] = useState<ConductorEstado | null>(null);
  const [posicionActual, setPosicionActual] = useState<{latitud: string, longitud: string} | null>(null);

  //estado del conductor
  useEffect(() => {
    const verificarEstadoConductor = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        if (!userId) {
          console.error("No se encontró ID de usuario");
          return;
        }

        //posición actual conductor
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setPosicionActual({
                latitud: position.coords.latitude.toString(),
                longitud: position.coords.longitude.toString()
              });
            },
            (error) => {
              console.error("Error obteniendo geolocalización:", error);
            }
          );
        }

        // estado del conductor
        const response = await fetch(`http://localhost:5000/verificar-estado/${userId}`);
        const data = await response.json();
        setConductorActivo(data);
      } catch (error) {
        console.error("Error al verificar estado del conductor", error);
      } finally {
        setLoading(false);
      }
    };

    verificarEstadoConductor();
  }, []);

  // activacion servicios del conductor
  const activarServicios = async () => {
    if (!posicionActual) {
      alert("No se pudo obtener tu ubicación actual. Por favor, permite el acceso a la ubicación.");
      return;
    }

    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) return;

      const response = await fetch("http://localhost:5000/activar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          latitud: posicionActual.latitud,
          longitud: posicionActual.longitud
        }),
      });

      const data = await response.json();
      if (data.success) {
        // actualizar estado del conductor
        const estadoResponse = await fetch(`http://localhost:5000/verificar-estado/${userId}`);
        const estadoData = await estadoResponse.json();
        setConductorActivo(estadoData);
      } else {
        alert("No se pudo activar tus servicios. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al activar servicios", error);
      alert("Ocurrió un error al activar tus servicios.");
    } finally {
      setLoading(false);
    }
  };

  // Obtener viajes disponibles si el conductor está activo
  useEffect(() => {
    if (!conductorActivo?.activo) return;
    
    const fetchViajesYConcentraciones = async () => {
      setLoading(true);
      try {
        // 1. Obtener ID del usuario y buscar ID del conductor
        const userId = getUserId();

        const resConductores = await fetch(`https://drivup-backend.onrender.com/conductores`);
        const conductores = await resConductores.json();
        const conductor = conductores.find((c: any) => c.user_id === Number(userId));
        if (!conductor) {
          console.error("No se encontró el conductor con ese userId");
          return;
        }

        const conductorId = conductor.id;

        // 2. Obtener los puntos de concentración
        const resPuntos = await fetch(`https://drivup-backend.onrender.com/puntos-concentracion`);
        const puntos = await resPuntos.json();
        const mapaPuntos = new Map<number, string>(
          puntos.map((punto: any) => [punto.id, punto.nombre])
        );

        // 3. Obtener los viajes disponibles del conductor
        const resViajes = await fetch(`https://drivup-backend.onrender.com/viajes-disponibles/${conductorId}`);
        const data = await resViajes.json();

        // 4. Transformar los viajes para el frontend
        const viajesTransformados: Viaje[] = data.viajes.map((viaje: any) => ({
          id: viaje.id,
          punto_concentracion: mapaPuntos.get(viaje.punto_concentracion_id) || "Nombre no disponible",
          tiempo_estimado: viaje.tiempo_estimado_min || "N/A",
          distancia_km: viaje.distancia_km || 0,
          ganancia_estimada: viaje.ganancia_estimada_conductor || 0,
          cantidad_pasajeros: viaje.numero_pasajeros_total || 0
        }));

        setViajes(viajesTransformados);

      } catch (error) {
        console.error("Error al obtener viajes", error);
      }
       setLoading(false);
    };

    fetchViajesYConcentraciones();
  }, [conductorActivo]);

  // Pantalla de activación de servicios
  const ActivacionServiciosScreen = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md mx-auto my-10 max-w-md">
      <h2 className="text-2xl font-bold text-[#2D5DA1] mb-4 text-center">
        Activa tus servicios para que el sistema te recomiende viajes
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Necesitas activar tus servicios para ver viajes disponibles en tu zona
      </p>
      <button
        onClick={activarServicios}
        className="px-6 py-3 bg-[#F2B134] text-white rounded-lg hover:bg-[#d79b28] transition font-bold text-lg shadow-md"
      >
        Haz clic aquí para activar
      </button>
    </div>
  );

  return (
    <HeaderFooterConductores>
      <div className="p-6">
        {loading && (
          <div className="flex justify-center mb-4 mt-4">
            <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
            <span className="ml-2 text-gray-700">Cargando...</span>
          </div>
        )}

        {!loading && conductorActivo && (
          <>
            {conductorActivo.activo ? (
              <>
                <h1 className="text-2xl font-bold mb-4">Ofertas Cercanas</h1>

                <div className="grid gap-4">
                  {viajes.map((viaje) => (
                    <div
                      key={viaje.id}
                      className="flex justify-between items-center border p-4 rounded shadow-md bg-white"
                    >
                      {/* Lado izquierdo con info */}
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2 text-[#2D5DA1]">
                          {viaje.punto_concentracion}
                        </h2>

                        <div className="flex space-x-6 text-gray-700">
                          <div className="flex items-center space-x-2">
                            <FaClock className="text-[#F2B134]" />
                            <span>{viaje.tiempo_estimado}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaRoad className="text-[#F2B134]" />
                            <span>{viaje.distancia_km} km</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaDollarSign className="text-[#F2B134]" />
                            <span>${viaje.ganancia_estimada}</span>
                          </div>
                        </div>
                      </div>
                      {/* Botones */}
                      <div className="flex space-x-4 mt-2">
                        <button
                          className="px-4 py-2 bg-[#2D5DA1] text-white rounded hover:bg-[#244b85] transition"
                          onClick={() => console.log("Ver detalles del viaje", viaje.id)}
                        >
                          Ver detalles
                        </button>
                        <button
                          className="px-4 py-2 bg-[#F2B134] text-white rounded hover:bg-[#d79b28] transition"
                          onClick={() => console.log("Aceptar oferta del viaje", viaje.id)}
                        >
                          Aceptar oferta
                        </button>
                      </div>

                      {/* Lado derecho: Pasajeros */}
                      <div className="text-right ml-6 border-l pl-6">
                        <p className="text-gray-500 text-sm">Pasajeros</p>
                        <p className="text-2xl font-bold text-[#2D5DA1] flex items-center justify-end">
                          <FaUsers className="mr-2 text-[#F2B134]" />
                          {viaje.cantidad_pasajeros}
                        </p>
                      </div>
                    </div>
                  ))}
                  {viajes.length === 0 && !loading && (
                    <div className="text-center p-10">
                      <p className="text-gray-600">No hay viajes disponibles en este momento.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <ActivacionServiciosScreen />
            )}
          </>
        )}
      </div>
    </HeaderFooterConductores>
  );
};

export default ListaViajes;