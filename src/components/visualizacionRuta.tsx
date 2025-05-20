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
    // 1. Obtener la ruta del backend
    fetch('http://localhost:5000/ruta-ejemplo', { method: 'POST' })
      .then(res => res.json())
      .then((data: Ruta) => {
        setRuta(data);

        // 2. Armar coordenadas para ORS y llamar a la API
        const coords = [
          [data.origen.lng, data.origen.lat],
          ...data.puntos_intermedios.map(p => [p.lng, p.lat]),
          [data.destino.lng, data.destino.lat]
        ];

        const apiKey = '5b3ce3597851110001cf6248affbba7491814f6b8dc47498b52f0175';  // mejor usar variable de entorno

        fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates: coords }),
        })
        .then(res => res.json())
        .then(setGeojsonRuta)
        .catch(err => console.error('Error ORS:', err));
      })
      .catch(err => console.error('Error backend:', err));
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