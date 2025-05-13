import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaf marker icons fix
const createLeafletIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapPreviewProps {
  title?: string;
  originCoords?: string;
  destinationCoords?: string;
}

const MapPreview = ({ 
  title = "Mapa con ruta prevista",
  originCoords,
  destinationCoords
}: MapPreviewProps) => {
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useState<HTMLDivElement | null>(null);
  const mapInstanceRef = useState<any>(null);

  // Default position (Barranquilla, Colombia)
  const defaultPosition: Coordinates = { lat: 11.0041, lng: -74.8070 };

  useEffect(() => {
    const processOriginCoordinates = async () => {
      if (!originCoords) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Handle "Mi ubicación actual" format (from navigator.geolocation)
        if (originCoords.includes(',')) {
          const [lat, lng] = originCoords.split(',').map(coord => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            setOrigin({ lat, lng });
            return;
          }
        }
        
        // Handle manual address through API
        const response = await fetch('http://localhost:5000/direccion-a-coordenadas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            direccion: originCoords
          })
        });
        
        const data = await response.json();
        if (data.success && data.coordenadas) {
          setOrigin({ 
            lat: data.coordenadas.lat, 
            lng: data.coordenadas.lon 
          });
        } else {
          setError("No se pudieron obtener las coordenadas de origen");
        }
      } catch (err) {
        console.error("Error al procesar coordenadas de origen:", err);
        setError("Error al procesar la dirección de origen");
      } finally {
        setLoading(false);
      }
    };
    
    const processDestinationCoordinates = async () => {
      if (!destinationCoords) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Handle coordinates directly format
        if (destinationCoords.includes(',')) {
          const [lat, lng] = destinationCoords.split(',').map(coord => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            setDestination({ lat, lng });
            return;
          }
        }
        
        // Handle manual address through API
        const response = await fetch('http://localhost:5000/direccion-a-coordenadas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            direccion: destinationCoords
          })
        });
        
        const data = await response.json();
        if (data.success && data.coordenadas) {
          setDestination({ 
            lat: data.coordenadas.lat, 
            lng: data.coordenadas.lon 
          });
        } else {
          setError("No se pudieron obtener las coordenadas de destino");
        }
      } catch (err) {
        console.error("Error al procesar coordenadas de destino:", err);
        setError("Error al procesar la dirección de destino");
      } finally {
        setLoading(false);
      }
    };

    if (originCoords) processOriginCoordinates();
    if (destinationCoords) processDestinationCoordinates();
  }, [originCoords, destinationCoords]);

  // Calculate the center and zoom based on available coordinates
  const getMapConfig = () => {
    if (origin && destination) {
      const center = {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2
      };
      return { center, zoom: 12 };
    } else if (origin) {
      return { center: origin, zoom: 14 };
    } else if (destination) {
      return { center: destination, zoom: 14 };
    } else {
      return { center: defaultPosition, zoom: 13 };
    }
  };

  // Initialize the map with vanilla Leaflet (bypassing React components entirely)
  useEffect(() => {
    if (!origin && !destination) return;
    if (loading || error) return;

    // Clean up previous map instance if it exists
    if (mapInstanceRef[0]) {
      mapInstanceRef[0].remove();
      mapInstanceRef[0] = null;
    }

    if (!mapRef[0]) return;

    // Initialize map with vanilla Leaflet
    const { center, zoom } = getMapConfig();
    const map = L.map(mapRef[0]).setView([center.lat, center.lng], zoom);
    
    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add origin marker if it exists
    if (origin) {
      const originMarker = L.marker([origin.lat, origin.lng], { 
        icon: createLeafletIcon('blue') 
      }).addTo(map);
      originMarker.bindPopup('Origen');
    }

    // Add destination marker if it exists
    if (destination) {
      const destMarker = L.marker([destination.lat, destination.lng], { 
        icon: createLeafletIcon('green') 
      }).addTo(map);
      destMarker.bindPopup('Destino');
    }

    // Add polyline if both origin and destination exist
    if (origin && destination) {
      L.polyline(
        [[origin.lat, origin.lng], [destination.lat, destination.lng]],
        { 
          color: '#2D5DA1',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 10'
        }
      ).addTo(map);
    }

    // Store map instance for cleanup
    mapInstanceRef[0] = map;
    setMapLoaded(true);

    // Cleanup function
    return () => {
      if (mapInstanceRef[0]) {
        mapInstanceRef[0].remove();
        mapInstanceRef[0] = null;
      }
      setMapLoaded(false);
    };
  }, [origin, destination, loading, error]);

  const setMapContainer = (element: HTMLDivElement | null) => {
    mapRef[0] = element;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="h-[400px] bg-[#F8F9FA] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-[#2D5DA1] mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-[#4A4E69]">Cargando mapa...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-red-50 rounded-lg max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}
        
        {!origin && !destination && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4A4E69]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-[#4A4E69]/60 text-lg">{title}</span>
              <p className="text-[#4A4E69]/40 text-sm mt-2">Seleccione origen y destino para visualizar la ruta</p>
            </div>
          </div>
        )}
        
        {/* The map container element - vanilla Leaflet will attach to this div */}
        <div 
          ref={setMapContainer} 
          className="h-full w-full"
          style={{ display: (!origin && !destination) || loading || error ? 'none' : 'block' }}
        ></div>
      </div>
    </div>
  );
};

export default MapPreview; 