import { useEffect, useState, useRef } from 'react';
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
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const originTimeoutRef = useRef<number | null>(null);
    const destinationTimeoutRef = useRef<number | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');

    // Default position (Barranquilla, Colombia)
    const defaultPosition: Coordinates = { lat: 11.0041, lng: -74.8070 };

    // Función de debug para entender el estado de la carga
    const addDebugInfo = (info: string) => {
        setDebugInfo(prev => `${prev}\n${info}`);
    };

    useEffect(() => {
        const processOriginCoordinates = async () => {
            if (!originCoords) return;
            
            try {
                setLoading(true);
                setError(null);
                addDebugInfo(`Procesando origen: ${originCoords}`);
                
                // Handle "Mi ubicación actual" format (from navigator.geolocation)
                if (originCoords.includes(',')) {
                    const [lat, lng] = originCoords.split(',').map(coord => parseFloat(coord.trim()));
                    if (!isNaN(lat) && !isNaN(lng)) {
                        addDebugInfo(`Origen latitud/longitud detectados: ${lat}, ${lng}`);
                        setOrigin({ lat, lng });
                        setLoading(false);
                        return;
                    }
                }
                
                // If input is 'manual' or type "hcp", don't attempt geocoding if empty
                if (originCoords === 'manual' || originCoords === 'hcp' || originCoords.trim() === '') {
                    addDebugInfo('Origen tipo "manual" o "hcp" sin dirección, no se procesa');
                    setLoading(false);
                    return;
                }
                
                // Handle manual address through API
                // Clear previous timeout
                if (originTimeoutRef.current) {
                    clearTimeout(originTimeoutRef.current);
                }
                
                // Set a delay to avoid making too many requests while user is typing
                originTimeoutRef.current = window.setTimeout(async () => {
                    try {
                        addDebugInfo(`Enviando solicitud para origen: ${originCoords}`);
                        const response = await fetch('http://localhost:5000/direccion-a-coordenadas', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                direccion: originCoords
                            })
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Error HTTP: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        if (data.success && data.coordenadas) {
                            addDebugInfo(`Coordenadas de origen recibidas: ${data.coordenadas.lat}, ${data.coordenadas.lon}`);
                            setOrigin({ 
                                lat: data.coordenadas.lat, 
                                lng: data.coordenadas.lon 
                            });
                        } else {
                            addDebugInfo(`Error al recibir coordenadas de origen: ${JSON.stringify(data)}`);
                            console.warn("No se pudieron obtener coordenadas:", data);
                            setError("No se pudieron obtener las coordenadas de origen");
                        }
                    } catch (err) {
                        addDebugInfo(`Error en la solicitud de origen: ${err}`);
                        console.error("Error al procesar coordenadas de origen:", err);
                        setError("Error al procesar la dirección de origen");
                    } finally {
                        setLoading(false);
                    }
                }, 1000); // Delay de 1 segundo
            } catch (err) {
                addDebugInfo(`Error general en procesamiento de origen: ${err}`);
                console.error("Error al procesar coordenadas de origen:", err);
                setError("Error al procesar la dirección de origen");
                setLoading(false);
            }
        };
        
        const processDestinationCoordinates = async () => {
            if (!destinationCoords) return;
            
            try {
                setLoading(true);
                setError(null);
                addDebugInfo(`Procesando destino: ${destinationCoords}`);
                
                // Handle coordinates directly format
                if (destinationCoords.includes(',')) {
                    const [lat, lng] = destinationCoords.split(',').map(coord => parseFloat(coord.trim()));
                    if (!isNaN(lat) && !isNaN(lng)) {
                        addDebugInfo(`Destino latitud/longitud detectados: ${lat}, ${lng}`);
                        setDestination({ lat, lng });
                        setLoading(false);
                        return;
                    }
                }
                
                // If input is 'manual' or type "hcp", don't attempt geocoding if empty
                if (destinationCoords === 'manual' || destinationCoords === 'hcp' || destinationCoords.trim() === '') {
                    addDebugInfo('Destino tipo "manual" o "hcp" sin dirección, no se procesa');
                    setLoading(false);
                    return;
                }
                
                // Handle manual address through API
                // Clear previous timeout
                if (destinationTimeoutRef.current) {
                    clearTimeout(destinationTimeoutRef.current);
                }
                
                // Set a delay to avoid making too many requests while user is typing
                destinationTimeoutRef.current = window.setTimeout(async () => {
                    try {
                        addDebugInfo(`Enviando solicitud para destino: ${destinationCoords}`);
                        const response = await fetch('http://localhost:5000/direccion-a-coordenadas', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                direccion: destinationCoords
                            })
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Error HTTP: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        if (data.success && data.coordenadas) {
                            addDebugInfo(`Coordenadas de destino recibidas: ${data.coordenadas.lat}, ${data.coordenadas.lon}`);
                            setDestination({ 
                                lat: data.coordenadas.lat, 
                                lng: data.coordenadas.lon 
                            });
                        } else {
                            addDebugInfo(`Error al recibir coordenadas de destino: ${JSON.stringify(data)}`);
                            console.warn("No se pudieron obtener coordenadas:", data);
                            setError("No se pudieron obtener las coordenadas de destino");
                        }
                    } catch (err) {
                        addDebugInfo(`Error en la solicitud de destino: ${err}`);
                        console.error("Error al procesar coordenadas de destino:", err);
                        setError("Error al procesar la dirección de destino");
                    } finally {
                        setLoading(false);
                    }
                }, 1000); // Delay de 1 segundo
            } catch (err) {
                addDebugInfo(`Error general en procesamiento de destino: ${err}`);
                console.error("Error al procesar coordenadas de destino:", err);
                setError("Error al procesar la dirección de destino");
                setLoading(false);
            }
        };

        if (originCoords) {
            processOriginCoordinates();
        } else {
            addDebugInfo('No hay coordenadas de origen');
        }
        
        if (destinationCoords) {
            processDestinationCoordinates();
        } else {
            addDebugInfo('No hay coordenadas de destino');
        }
        
        // Cleanup function to clear any pending timeouts
        return () => {
            if (originTimeoutRef.current) {
                clearTimeout(originTimeoutRef.current);
            }
            if (destinationTimeoutRef.current) {
                clearTimeout(destinationTimeoutRef.current);
            }
        };
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
        const initializeMap = () => {
            try {
                addDebugInfo('Intentando inicializar mapa...');
                
                // Si no hay origen ni destino y no está cargando o con error, mostramos el mensaje inicial
                if (!origin && !destination) {
                    addDebugInfo('No hay origen ni destino para mostrar en el mapa');
                    setLoading(false);
                    return;
                }
                
                if (loading) {
                    addDebugInfo('Cargando, esperando...');
                    return;
                }
                
                if (error) {
                    addDebugInfo(`Error presente: ${error}`);
                    return;
                }
                
                // Verificamos si el elemento del DOM está presente
                if (!mapContainerRef.current) {
                    addDebugInfo('El contenedor del mapa no está disponible');
                    return;
                }
                
                // Limpiamos cualquier mapa previo
                if (mapInstanceRef.current) {
                    addDebugInfo('Limpiando mapa anterior');
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                }

                // Configuramos el mapa
                const { center, zoom } = getMapConfig();
                addDebugInfo(`Creando mapa con centro: ${center.lat}, ${center.lng}, zoom: ${zoom}`);
                
                // Creamos la instancia de mapa
                const map = L.map(mapContainerRef.current).setView([center.lat, center.lng], zoom);
                
                // Añadimos la capa de tiles
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                
                // Añadimos marcador de origen si existe
                if (origin) {
                    addDebugInfo(`Añadiendo marcador de origen: ${origin.lat}, ${origin.lng}`);
                    const originMarker = L.marker([origin.lat, origin.lng], { 
                        icon: createLeafletIcon('blue') 
                    }).addTo(map);
                    originMarker.bindPopup('Origen').openPopup();
                }
                
                // Añadimos marcador de destino si existe
                if (destination) {
                    addDebugInfo(`Añadiendo marcador de destino: ${destination.lat}, ${destination.lng}`);
                    const destMarker = L.marker([destination.lat, destination.lng], { 
                        icon: createLeafletIcon('green') 
                    }).addTo(map);
                    destMarker.bindPopup('Destino');
                }
                
                // Añadimos línea entre puntos si ambos existen
                if (origin && destination) {
                    addDebugInfo('Añadiendo línea entre puntos');
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
                
                // Guardamos la instancia del mapa para limpieza posterior
                mapInstanceRef.current = map;
                
                // Refrescamos el mapa para asegurar que se dibuje correctamente
                setTimeout(() => {
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.invalidateSize();
                        addDebugInfo('Mapa inicializado correctamente');
                    }
                }, 100);
            } catch (err) {
                addDebugInfo(`Error al inicializar el mapa: ${err}`);
                console.error('Error al inicializar el mapa:', err);
                setError(`Error al cargar el mapa: ${err}`);
            }
        };

        initializeMap();
        
        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                addDebugInfo('Mapa eliminado en limpieza');
            }
        };
    }, [origin, destination, loading, error]);

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

                {/* Contenedor del mapa */}
                <div
                    ref={mapContainerRef}
                    className="h-full w-full"
                    style={{ 
                        display: (!origin && !destination) || loading || error ? 'none' : 'block',
                        zIndex: 1
                    }}
                ></div>
                
                {/* La sección de depuración está desactivada - Activar solo para desarrollo */}
                {false && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 z-50 text-xs max-h-[150px] overflow-auto">
                        <pre>{debugInfo}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPreview; 