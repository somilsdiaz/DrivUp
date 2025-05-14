import { useState, useEffect, useRef, useCallback } from 'react';
import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import LocationSelector from '../../components/solicitarViaje/LocationSelector';
import RideDetails from '../../components/solicitarViaje/RideDetails';
import MapPreview from '../../components/solicitarViaje/MapPreview';
import RequestStatus from '../../components/solicitarViaje/RequestStatus';
import DriverInfo from '../../components/solicitarViaje/DriverInfo';
import { getUserId } from '../../utils/auth';

interface ConcentrationPoint {
    id: number;
    nombre: string;
    latitud: string;
    longitud: string;
    descripcion: string | null;
    created_at: string;
    updated_at: string;
    direccion_fisica: string;
}

const SolicitarViaje = () => {
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [rideAccepted, setRideAccepted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [estimatedArrival, setEstimatedArrival] = useState('');
    const [concentrationPoints, setConcentrationPoints] = useState<ConcentrationPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [originCoords, setOriginCoords] = useState<string | undefined>(undefined);
    const [destinationCoords, setDestinationCoords] = useState<string | undefined>(undefined);
    const [locationType, setLocationType] = useState<{ origin: string; destination: string }>({
        origin: 'current',
        destination: 'manual'
    });
    const [originConcentrationPointId, setOriginConcentrationPointId] = useState<number | null>(null);
    const [destinationConcentrationPointId, setDestinationConcentrationPointId] = useState<number | null>(null);
    const [submittingRequest, setSubmittingRequest] = useState(false);

    // Mock data
    const rideEstimation = {
        distance: '12.5 km',
        duration: '25 min',
        price: '$15,000 COP',
        surge: 1.2,
        basePrice: 12500,
        surgeMultiplier: 1.2,
        serviceFee: 2000,
        totalPrice: 15000,
    };

    const driverInfo = {
        name: 'Carlos Rodriguez',
        rating: 4.8,
        vehicle: 'Chevrolet Spark',
        plate: 'ABC123',
        eta: '5 min',
        arrivalTime: '35 min',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        completedRides: 1245,
        languages: ['Español', 'Inglés'],
        vehicleFeatures: ['A/C', 'Música', 'Wifi'],
    };

    // Fetch concentration points from API
    useEffect(() => {
        const fetchConcentrationPoints = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('http://localhost:5000/puntos-concentracion');
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                setConcentrationPoints(data);
            } catch (err) {
                setError('Error al cargar los puntos de concentración');
                console.error('Error fetching concentration points:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConcentrationPoints();
    }, []);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Calculate estimated arrival time
    useEffect(() => {
        if (rideEstimation.duration) {
            const [minutes] = rideEstimation.duration.split(' ');
            const arrival = new Date();
            arrival.setMinutes(arrival.getMinutes() + parseInt(minutes));
            setEstimatedArrival(arrival.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
        }
    }, [rideEstimation.duration]);

    // Check if coordinates belong to a concentration point
    const isConcentrationPoint = async (lat: string, lon: string): Promise<boolean> => {
        try {
            const response = await fetch(`http://localhost:5000/verificar-punto-concentracion?lat=${lat}&lon=${lon}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.esPuntoConcentracion;
        } catch (error) {
            console.error("Error verificando punto de concentración:", error);
            return false;
        }
    };

    // Convert address to coordinates
    const convertAddressToCoordinates = async (address: string): Promise<{lat: string, lon: string} | null> => {
        try {
            const response = await fetch("http://localhost:5000/direccion-a-coordenadas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ direccion: address }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                return {
                    lat: data.coordenadas.lat.toString(),
                    lon: data.coordenadas.lon.toString()
                };
            }
            return null;
        } catch (error) {
            console.error("Error convirtiendo dirección a coordenadas:", error);
            return null;
        }
    };

    // Check if coordinates match a concentration point and return its ID
    const checkConcentrationPoint = async (lat: string, lon: string): Promise<number | null> => {
        try {
            // Get if the point is near a concentration point
            const isNearConcentration = await isConcentrationPoint(lat, lon);
            
            if (isNearConcentration) {
                // Find the closest concentration point
                const response = await fetch(`http://localhost:5000/puntos-concentracion-cercanos?lat=${lat}&lon=${lon}&limit=1`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.puntos && data.puntos.length > 0) {
                    return data.puntos[0].id;
                }
            }
            
            return null;
        } catch (error) {
            console.error("Error verificando puntos de concentración cercanos:", error);
            return null;
        }
    };

    // Debounce function to delay API calls
    const useDebounce = (callback: Function, delay: number) => {
        const timeoutRef = useRef<NodeJS.Timeout | null>(null);
        
        return useCallback((...args: any[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }, [callback, delay]);
    };

    const handleSubmitRequest = async () => {
        if (!originCoords || !destinationCoords) {
            setError("Por favor seleccione origen y destino válidos");
            return;
        }

        const userId = getUserId();
        if (!userId) {
            setError("Usuario no autenticado");
            return;
        }

        setSubmittingRequest(true);
        setError(null);

        try {
            // Parse coordinates
            const [originLat, originLon] = originCoords.split(',');
            const [destLat, destLon] = destinationCoords.split(',');

            // Determine if origin is a concentration point
            let isOriginConcentration = locationType.origin === 'hcp';
            let originPointId = originConcentrationPointId;

            // Determine if destination is a concentration point
            let isDestinationConcentration = locationType.destination === 'hcp';
            let destinationPointId = destinationConcentrationPointId;

            // If the user hasn't explicitly selected a concentration point, check if the coordinates match one
            if (!isOriginConcentration) {
                const nearPointId = await checkConcentrationPoint(originLat, originLon);
                if (nearPointId) {
                    isOriginConcentration = true;
                    originPointId = nearPointId;
                }
            }

            if (!isDestinationConcentration) {
                const nearPointId = await checkConcentrationPoint(destLat, destLon);
                if (nearPointId) {
                    isDestinationConcentration = true;
                    destinationPointId = nearPointId;
                }
            }

            // Validate that at least one point is a concentration point
            if (!isOriginConcentration && !isDestinationConcentration) {
                setError("Al menos un punto (origen o destino) debe ser un punto de concentración.");
                setSubmittingRequest(false);
                return;
            }

            // Create request body
            const requestBody = {
                pasajero_id: parseInt(userId),
                origen_lat: parseFloat(originLat),
                origen_lon: parseFloat(originLon),
                destino_lat: parseFloat(destLat),
                destino_lon: parseFloat(destLon),
                es_origen_concentracion: isOriginConcentration,
                origen_pmcp_id: isOriginConcentration ? originPointId : null,
                es_destino_concentracion: isDestinationConcentration,
                destino_pmcp_id: isDestinationConcentration ? destinationPointId : null
            };

            // Validate data completeness before sending
            if (isOriginConcentration && !originPointId) {
                setError("El origen es un punto de concentración pero no se ha identificado el ID del punto.");
                setSubmittingRequest(false);
                return;
            }

            if (isDestinationConcentration && !destinationPointId) {
                setError("El destino es un punto de concentración pero no se ha identificado el ID del punto.");
                setSubmittingRequest(false);
                return;
            }

            console.log("Sending ride request:", requestBody);

            // Send request to API
            const response = await fetch("http://localhost:5000/solicitudes-viaje", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("Ride request submitted successfully:", responseData);

            // Request submitted successfully
            setRequestSubmitted(true);
            
            // Simulate driver acceptance (in a real app, this would come from a websocket or polling)
            setTimeout(() => setRideAccepted(true), 3000);
        } catch (error) {
            console.error("Error al enviar solicitud de viaje:", error);
            setError(error instanceof Error ? error.message : "Error al enviar la solicitud de viaje");
        } finally {
            setSubmittingRequest(false);
        }
    };

    const handleCancelRequest = () => {
        setRequestSubmitted(false);
        setRideAccepted(false);
    };

    const handleLocationChange = async (type: string, value: string, locType?: string, pointId?: number) => {
        // Handle location changes here
        console.log(`Location ${type} changed to:`, value, locType);
        
        // Update the location type
        if (locType) {
            setLocationType(prev => ({ ...prev, [type]: locType }));
        }
        
        // Handle different location types
        if (locType === 'current' || locType === 'hcp') {
            // For current location or concentration points, we already have coordinates
            if (type === 'origin') {
                setOriginCoords(value);
                if (pointId) {
                    setOriginConcentrationPointId(pointId);
                }
            } else if (type === 'destination') {
                setDestinationCoords(value);
                if (pointId) {
                    setDestinationConcentrationPointId(pointId);
                }
            }
        }
    };

    // Process manual address after typing has stopped
    const processManualAddress = useDebounce(async (type: string, value: string) => {
        if (value.trim() === '') return;
        
        try {
            const coords = await convertAddressToCoordinates(value);
            if (coords) {
                const coordString = `${coords.lat},${coords.lon}`;
                if (type === 'origin') {
                    setOriginCoords(coordString);
                    setOriginConcentrationPointId(null);
                } else if (type === 'destination') {
                    setDestinationCoords(coordString);
                    setDestinationConcentrationPointId(null);
                }
            }
        } catch (error) {
            console.error(`Error converting ${type} address to coordinates:`, error);
            setError(`Error al convertir la dirección de ${type === 'origin' ? 'origen' : 'destino'} a coordenadas`);
        }
    }, 1000); // 1 second delay

    // Handle manual address input
    const handleManualAddressInput = (type: string, value: string) => {
        // Just update the location type, but don't trigger coordinate conversion yet
        if (type === 'origin' || type === 'destination') {
            // Call the debounced function to process the address
            processManualAddress(type, value);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <HeaderFooterPasajeros>
            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Header Section with Gradient - Full Width */}
                <div className="w-full bg-gradient-to-r from-[#2D5DA1] to-[#5AAA95] p-8 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                    <div className="max-w-7xl mx-auto relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-3">Solicitar Viaje</h1>
                                <p className="text-xl text-white/80">Encuentra tu viaje de manera rápida y segura</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                                <p className="text-sm opacity-80">Hora actual</p>
                                <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    {!requestSubmitted ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Location Selection */}
                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    {loading && (
                                        <div className="p-8 text-center">
                                            <p className="text-[#4A4E69]">Cargando puntos de concentración...</p>
                                        </div>
                                    )}
                                    
                                    {error && (
                                        <div className="p-8 text-center">
                                            <p className="text-red-500">{error}</p>
                                        </div>
                                    )}
                                    
                                    {!loading && !error && (
                                        <>
                                            <LocationSelector 
                                                type="origin" 
                                                onLocationChange={handleLocationChange} 
                                                onManualAddressInput={handleManualAddressInput}
                                                concentrationPoints={concentrationPoints}
                                            />
                                            <LocationSelector 
                                                type="destination" 
                                                onLocationChange={handleLocationChange} 
                                                onManualAddressInput={handleManualAddressInput}
                                                concentrationPoints={concentrationPoints}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Map and Details */}
                            <div className="space-y-8">
                                <MapPreview 
                                    originCoords={originCoords} 
                                    destinationCoords={destinationCoords} 
                                />
                                <RideDetails rideEstimation={rideEstimation} />
                                <button
                                    className="w-full bg-[#F2B134] text-[#4A4E69] py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#F2B134]/90 transition-all duration-200 transform hover:scale-[1.02] mb-4 flex items-center justify-center"
                                    onClick={handleSubmitRequest}
                                    disabled={loading || !!error || !originCoords || !destinationCoords || submittingRequest}
                                >
                                    {submittingRequest ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#4A4E69]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando solicitud...
                                        </>
                                    ) : 'Enviar Solicitud'}
                                </button>
                                
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {!rideAccepted ? (
                                <RequestStatus onCancel={handleCancelRequest} />
                            ) : (
                                <DriverInfo 
                                    driverInfo={driverInfo}
                                    estimatedArrival={estimatedArrival}
                                    onCancel={handleCancelRequest}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HeaderFooterPasajeros>
    );
};

export default SolicitarViaje;
