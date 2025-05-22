import { useEffect, useState } from 'react';
import MapaRuta from './mapaRuta';

type Punto = { lat: number; lng: number; };

type Ruta = {
  origen: Punto;
  destino: Punto;
  puntos_intermedios: Punto[];
};

type IdViajeProps = {
  viajeId: number;
}

const VisualizacionRuta = ({ viajeId }: IdViajeProps) => {
  const viajeIdNumero = Number(viajeId);
  console.log(viajeIdNumero);

  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [loading, setLoading] = useState(false);
  const [geojsonRuta, setGeojsonRuta] = useState<any | null>(null);

  useEffect(() => {
  const obtenerRuta = async () => {
    setLoading(true);

    // Validación inicial
    if (!viajeId || isNaN(viajeIdNumero)) {
      console.error("viajeId no es válido:", viajeId);
      setLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No se encontró userId en localStorage");
        return;
      }

      const resConductores = await fetch("https://drivup-backend.onrender.com/conductores");
      const conductores = await resConductores.json();
      const conductor = conductores.find((c: any) => c.user_id === Number(userId));

      if (!conductor) {
        console.error("No se encontró el conductor con ese userId");
        return;
      }

      const conductorId = conductor.id;
      const apiKey = import.meta.env.VITE_VISUALIZACION_RUTA_API_KEY;

      const resRuta = await fetch(`https://drivup-backend.onrender.com/ruta-viaje/${viajeIdNumero}/${conductorId}`);
      if (!resRuta.ok) {
        const errorText = await resRuta.text();
        console.error("Error en fetch de ruta:", resRuta.status, errorText);
        return;
      }

      const data: Ruta = await resRuta.json();
      setRuta(data);

      const coords = [
        [data.origen.lng, data.origen.lat],
        ...data.puntos_intermedios.map(p => [p.lng, p.lat]),
        [data.destino.lng, data.destino.lat],
      ];

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
}, [viajeId]);

  return (
    <div className="p-4 w-9/12 z-0">
      {loading ? (
        <div className="flex justify-center mb-4 mt-4">
          <div className="spinner-border animate-spin border-4 border-t-4 border-black-500 rounded-full w-8 h-8" />
          <span className="ml-2 text-gray-700">Cargando...</span>
        </div>
      ) : geojsonRuta && ruta ? (
        <MapaRuta geojsonRuta={geojsonRuta} rutaOriginal={ruta} />
      ) : (
        <p className="text-center text-red-500">No se pudo cargar la ruta</p>
      )}
    </div>
  );
};

export default VisualizacionRuta;
