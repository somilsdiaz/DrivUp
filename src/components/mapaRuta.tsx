import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';

type Punto = {
  lat: number;
  lng: number;
};

type MapaRutaProps = {
  geojsonRuta: any;
  rutaOriginal: {
    origen: Punto;
    destino: Punto;
    puntos_intermedios: Punto[];
  };
};

const MapaRuta = ({ geojsonRuta, rutaOriginal }: MapaRutaProps) => {
  if (!geojsonRuta || !rutaOriginal) return null;

  // Para centrar el mapa, puedes usar el origen
  const center: [number, number] = [rutaOriginal.origen.lat, rutaOriginal.origen.lng];

  // Marcadores sólo en los puntos originales
  const puntos = [
    { ...rutaOriginal.origen, label: 'Origen' },
    ...rutaOriginal.puntos_intermedios.map((p, i) => ({ ...p, label: `Punto Intermedio ${i + 1}` })),
    { ...rutaOriginal.destino, label: 'Destino' },
  ];

  return (
    <MapContainer center={center} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {puntos.map(({ lat, lng, label }, idx) => (
        <Marker key={idx} position={[lat, lng]}>
          <Popup>{label}</Popup>
        </Marker>
      ))}
      <GeoJSON data={geojsonRuta} style={{ color: 'blue', weight: 4 }} />
    </MapContainer>
  );
};

export default MapaRuta;
