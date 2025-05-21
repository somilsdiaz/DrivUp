import { useEffect, useState } from 'react';
import MapaRuta from './mapaRuta';

type Punto = { lat: number; lng: number; };

type Ruta = {
  origen: Punto;
  destino: Punto;
  puntos_intermedios: Punto[];
};

const VisualizacionRuta = () => {
  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [geojsonRuta, setGeojsonRuta] = useState<any | null>(null);

  useEffect(() => {
  const obtenerRuta = async () => {
    try {
      // 1. Obtener userId desde localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No se encontró userId en localStorage");
        return;
      }

      // 2. Obtener lista de conductores
      const resConductores = await fetch("https://drivup-backend.onrender.com/conductores");
      const conductores = await resConductores.json();

      // 3. Buscar el conductor correspondiente
      const conductor = conductores.find((c: any) => c.user_id === Number(userId));
      if (!conductor) {
        console.error("No se encontró el conductor con ese userId");
        return;
      }

      const conductorId = conductor.id;
      const viajeId = 2; // Puedes cambiar esto por una prop o valor dinámico
      const apiKey = import.meta.env.VITE_VISUALIZACION_RUTA_API_KEY;

      // 4. Obtener ruta desde el backend
      const resRuta = await fetch(`https://drivup-backend.onrender.com/ruta-viaje/${viajeId}/${conductorId}`);
      const data: Ruta = await resRuta.json();

      setRuta(data);

      // 5. Preparar coordenadas para OpenRouteService
      const coords = [
        [data.origen.lng, data.origen.lat],
        ...data.puntos_intermedios.map(p => [p.lng, p.lat]),
        [data.destino.lng, data.destino.lat],
      ];

      // 6. Llamar a ORS
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
    }
  };

  obtenerRuta();
}, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Visualización de Ruta</h2>
      {geojsonRuta && ruta ? (
        <MapaRuta geojsonRuta={geojsonRuta} rutaOriginal={ruta} />
      ) : (
        <p>Cargando ruta...</p>
      )}
    </div>
  );
};

export default VisualizacionRuta;