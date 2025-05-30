import { useEffect, useState } from 'react';
import MapaRuta from './mapaRuta';

type Punto = { lat: number; lng: number; label?: string };

type Ruta = {
  origen: Punto;
  destino: Punto;
  puntos_intermedios: Punto[];
};

type IdViajeProps = { 
  viajeId: number;
  conductorId?: number;
};

const VisualizacionRuta = ({ viajeId, conductorId }: IdViajeProps) => {
  const viajeIdNumero = Number(viajeId);

  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [loading, setLoading] = useState(false);
  const [geojsonRuta, setGeojsonRuta] = useState<any | null>(null);
  const [ubicacionConductor, setUbicacionConductor] = useState<Punto | null>(null);


  useEffect(() => {
    const obtenerRuta = async () => {
      setLoading(true);

      if (!viajeId || isNaN(viajeIdNumero)) {
        console.error("viajeId no es válido:", viajeId);
        setLoading(false);
        return;
      }

      try {
        let conductorIdFinal = conductorId;
        
        // Solo buscar el conductorId si no fue proporcionado como prop
        if (!conductorIdFinal) {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            console.error("No se encontró userId en localStorage");
            setLoading(false);
            return;
          }

          // 1. Obtener conductorId
          const resConductores = await fetch("https://drivup-backend.onrender.com/conductores");
          const conductores = await resConductores.json();
          const conductor = conductores.find((c: any) => c.user_id === Number(userId));
          if (!conductor) {
            console.error("No se encontró el conductor con ese userId");
            setLoading(false);
            return;
          }
          conductorIdFinal = conductor.id;
        }

        // 1.2 obtener ubicacion del conductor
        // Obtener ubicación actual desde tabla conductores_activos_disponibles
        const resUbicacion = await fetch(`https://drivup-backend.onrender.com/conductores-activos-disponibles/${conductorIdFinal}`);
        if (!resUbicacion.ok) {
          console.error("No se pudo obtener la ubicación del conductor desde la tabla");
        } else {
          const dataUbicacion = await resUbicacion.json();
          if (dataUbicacion.length > 0) {
            const ubicacion = dataUbicacion[0];
            setUbicacionConductor({
              lat: parseFloat(ubicacion.ubicacion_actual_lat),
              lng: parseFloat(ubicacion.ubicacion_actual_lon),
              label: "Mi ubicación",
            });
          } else {
            console.warn("El conductor no tiene ubicación activa registrada");
          }
        }

        // 2. Obtener ruta base
        const resRuta = await fetch(`https://drivup-backend.onrender.com/ruta-viaje/${viajeIdNumero}/${conductorIdFinal}`);
        if (!resRuta.ok) {
          const errorText = await resRuta.text();
          console.error("Error en fetch de ruta:", resRuta.status, errorText);
          setLoading(false);
          return;
        }
        const dataRuta = await resRuta.json();

        // 3. Obtener viaje_pasajero para obtener solicitud_viaje_id
        const resViajePasajero = await fetch(`https://drivup-backend.onrender.com/viaje-pasajeros/${viajeIdNumero}`);
        if (!resViajePasajero.ok) {
          console.error("Error al obtener viaje-pasajeros");
          setLoading(false);
          return;
        }
        const viajePasajeros = await resViajePasajero.json();
        // Ejemplo estructura: [{ viaje_id, solicitud_viaje_id }, ...]

        // 4. Obtener solicitudes_viaje para obtener pasajero_id
        const resSolicitudes = await fetch("https://drivup-backend.onrender.com/solicitudes-viaje");
        if (!resSolicitudes.ok) {
          console.error("Error al obtener solicitudes_viaje");
          setLoading(false);
          return;
        }
        const solicitudes = await resSolicitudes.json();

        // Filtrar solicitudes que están en este viaje
        const solicitudesDelViaje = solicitudes.filter((sol: any) =>
          viajePasajeros.some((vp: any) => vp.solicitud_viaje_id === sol.id)
        );

        // 5. Por cada solicitud, obtener datos usuario
        // Para no hacer fetch secuenciales, usamos Promise.all
        const pasajerosConNombres = await Promise.all(
          solicitudesDelViaje.map(async (sol: any) => {
            const resUsuario = await fetch(`https://drivup-backend.onrender.com/usuario/${sol.pasajero_id}`);
            if (!resUsuario.ok) {
              return null; // o algún valor por defecto
            }
            const usuario = await resUsuario.json();

            // Construir nombre completo sin nulls ni 'null'
            const nombreCompleto = [
              usuario.name,
              usuario.second_name,
              usuario.last_name,
              usuario.second_last_name,
            ]
              .filter((n) => n && n.toLowerCase() !== 'null')
              .join(' ');

            return {
              solicitudId: sol.id,
              pasajeroId: sol.pasajero_id,
              nombreCompleto,
              origen: { lat: sol.origen_lat, lng: sol.origen_lon },
              destino: { lat: sol.destino_lat, lng: sol.destino_lon },
            };
          })
        );

        // Contar cuántos pasajeros tienen origen o destino que coincide con el punto PMCP
        const tolerancia = 0.0005;

        const pasajerosConOrigenIgualAlPMCP = pasajerosConNombres.filter(p =>
          Math.abs(p.origen.lat - dataRuta.origen.lat) < tolerancia &&
          Math.abs(p.origen.lng - dataRuta.origen.lng) < tolerancia
        );

        const pasajerosConDestinoIgualAlPMCP = pasajerosConNombres.filter(p =>
          Math.abs(p.destino.lat - dataRuta.destino.lat) < tolerancia &&
          Math.abs(p.destino.lng - dataRuta.destino.lng) < tolerancia
        );

        // Decidir si el PMCP es origen o destino según cuál tiene más coincidencias
        const pmcpEsOrigen = pasajerosConOrigenIgualAlPMCP.length >= pasajerosConDestinoIgualAlPMCP.length;

        // 6. Ahora mapeamos puntos intermedios con nombres
        // Aquí tienes que decidir si los puntos intermedios corresponden al origen o destino del pasajero
        // Asumiendo que en ruta.puntos_intermedios están las coordenadas origen del pasajero, usamos eso para cruzar:

        const puntosIntermediosConNombre = dataRuta.puntos_intermedios.map((p: Punto) => {
          const tolerancia = 0.0005;

          // Dependiendo de si el PMCP es origen o destino, comparamos con destino u origen
          const pasajero = pasajerosConNombres.find((pas) => {
            const puntoComparar = pmcpEsOrigen ? pas.destino : pas.origen;
            const distanciaLat = Math.abs(p.lat - puntoComparar.lat);
            const distanciaLng = Math.abs(p.lng - puntoComparar.lng);
            return distanciaLat < tolerancia && distanciaLng < tolerancia;
          });

          return pasajero
            ? { lat: p.lat, lng: p.lng, label: pasajero.nombreCompleto }
            : { lat: p.lat, lng: p.lng, label: "Punto Intermedio" };
        });


        // 7. Armar nueva ruta con label personalizado solo para origen
        // Función para encontrar nombre del pasajero por coordenadas
        const obtenerLabelPasajero = (punto: Punto, tipo: 'origen' | 'destino') => {
          const tolerancia = 0.0005;
          const pasajero = pasajerosConNombres.find(pas => {
            const puntoComparar = tipo === 'origen' ? pas.origen : pas.destino;
            return (
              Math.abs(punto.lat - puntoComparar.lat) < tolerancia &&
              Math.abs(punto.lng - puntoComparar.lng) < tolerancia
            );
          });

          return pasajero ? pasajero.nombreCompleto : tipo.charAt(0).toUpperCase() + tipo.slice(1);
        };



        const rutaConNombres: Ruta = {
          origen: {
            ...dataRuta.origen,
            label: pmcpEsOrigen
              ? "Origen"
              : obtenerLabelPasajero(dataRuta.origen, "origen"),
          },
          puntos_intermedios: puntosIntermediosConNombre,
          destino: {
            ...dataRuta.destino,
            label: pmcpEsOrigen
              ? obtenerLabelPasajero(dataRuta.destino, "destino")
              : "Destino",
          },
        };

        setRuta(rutaConNombres);

        // 8. Preparar coordenadas para ORS
        const coords = [
          [rutaConNombres.origen.lng, rutaConNombres.origen.lat],
          ...rutaConNombres.puntos_intermedios.map(p => [p.lng, p.lat]),
          [rutaConNombres.destino.lng, rutaConNombres.destino.lat],
        ];

        // 9. Fetch ruta ORS
        const apiKey = import.meta.env.VITE_VISUALIZACION_RUTA_API_KEY;
        const resORS = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates: coords }),
        });
        const geojson = await resORS.json();
        setGeojsonRuta(geojson);

      } catch (err) {
        console.error("Error al obtener y visualizar la ruta:", err);
      } finally {
        setLoading(false);
      }
    };

    obtenerRuta();
  }, [viajeId, conductorId]);

  return (
    <div className="p-4 w-full  md:w-9/12 z-0">
      {loading ? (
        <div className="flex justify-center mb-4 mt-4">
          <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
          <span className="ml-2 text-gray-700">Cargando...</span>
        </div>
      ) : geojsonRuta && ruta ? (
        <MapaRuta
          geojsonRuta={geojsonRuta}
          rutaOriginal={ruta}
          ubicacionConductor={ubicacionConductor}
        />
      ) : (
        <p className="text-center text-red-500">No se pudo cargar la ruta</p>
      )}
    </div>
  );
};

export default VisualizacionRuta;