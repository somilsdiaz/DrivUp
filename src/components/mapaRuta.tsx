import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Punto = {
  lat: number;
  lng: number;
  label?: string;
};

type MapaRutaProps = {
  geojsonRuta: any;
  rutaOriginal: {
    origen: Punto;
    destino: Punto;
    puntos_intermedios: Punto[];
  };
};

// ✅ Iconos personalizados
const iconoVerde = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconoRojo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconoAzul = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapaRuta = ({ geojsonRuta, rutaOriginal }: MapaRutaProps) => {
  if (!geojsonRuta || !rutaOriginal) return null;

  const center: [number, number] = [rutaOriginal.origen.lat, rutaOriginal.origen.lng];

  // Marcadores con tipo para seleccionar el color
  const puntos = [
    { ...rutaOriginal.origen, label: rutaOriginal.origen.label || 'Origen', tipo: 'origen' },
    ...rutaOriginal.puntos_intermedios.map((p, i) => ({
      ...p,
      label: p.label || `Punto Intermedio ${i + 1}`,
      tipo: 'intermedio',
    })),
    { ...rutaOriginal.destino, label: rutaOriginal.destino.label || 'Destino', tipo: 'destino' },
  ];

  const obtenerIcono = (tipo: string) => {
    switch (tipo) {
      case 'origen': return iconoVerde;
      case 'destino': return iconoRojo;
      default: return iconoAzul;
    }
  };

  return (
    <MapContainer center={center} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {puntos.map(({ lat, lng, label, tipo }, idx) => (
        <Marker key={idx} position={[lat, lng]} icon={obtenerIcono(tipo!)}>
          <Popup>{label}</Popup>
        </Marker>
      ))}
      <GeoJSON data={geojsonRuta} style={{ color: 'blue', weight: 4 }} />
    </MapContainer>
  );
};

export default MapaRuta;