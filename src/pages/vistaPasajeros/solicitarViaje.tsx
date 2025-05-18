import { useState, useEffect, useRef, useCallback } from 'react';
import HeaderFooterPasajeros from "../../layouts/headerFooterPasajeros";
import LocationSelector from '../../components/solicitarViaje/LocationSelector';
import RideDetails from '../../components/solicitarViaje/RideDetails';
import MapPreview from '../../components/solicitarViaje/MapPreview';
import RequestStatus from '../../components/solicitarViaje/RequestStatus';
import DriverInfo from '../../components/solicitarViaje/DriverInfo';
import ErrorModal from '../../components/solicitarViaje/ErrorModal';
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

// Define RideEstimation interface to match the component props
interface RideEstimation {
    distance: string;
    duration: string;
    price: string;
    basePrice: number;
    serviceFee: number;
    totalPrice: number;
    detailedData?: {
        distancia?: {
            metros: number;
            kilometros: number;
        };
        tiempo?: {
            tiempoTotalMinutos: number;
            desglose: {
                tiempoViajeBasico: number;
                tiempoTrafico: number;
                tiempoRecogida: number;
                tiempoLlegada: number;
            };
        };
        costo?: {
            costoMinimo: number;
            costoMaximo: number;
            desglose: {
                costoBase: number;
                costoPorPasajero: number;
                comisionPlataforma: number;
                factorPasajeros: number;
            };
        };
    };
    alternativeOptions?: {
        [key: string]: {
            costo: {
                costoMinimo: number;
                costoMaximo: number;
            };
        };
    };
}

// pagina principal para solicitar un viaje
const SolicitarViaje = () => {
    // estados para el flujo de la solicitud
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [rideAccepted, setRideAccepted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [estimatedArrival, setEstimatedArrival] = useState('');
    const [concentrationPoints, setConcentrationPoints] = useState<ConcentrationPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    
    // estados para las coordenadas y tipos de ubicacion
    const [originCoords, setOriginCoords] = useState<string | undefined>(undefined);
    const [destinationCoords, setDestinationCoords] = useState<string | undefined>(undefined);
    const [locationType, setLocationType] = useState<{ origin: string; destination: string }>({
        origin: 'current',
        destination: 'manual'
    });
    const [disabledOptions, setDisabledOptions] = useState<{
        origin: string[];
        destination: string[];
    }>({
        origin: [],
        destination: ['manual']  // Start with manual disabled for destination since origin starts as 'current'
    });
    const [originConcentrationPointId, setOriginConcentrationPointId] = useState<number | null>(null);
    const [destinationConcentrationPointId, setDestinationConcentrationPointId] = useState<number | null>(null);
    
    // estados para el proceso de solicitud
    const [submittingRequest, setSubmittingRequest] = useState(false);
    const [passengerCount, setPassengerCount] = useState<number>(4);
    const [calculatingRide, setCalculatingRide] = useState<boolean>(false);
    const [checkingActiveRequest, setCheckingActiveRequest] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    // Nuevo estado para controlar si la ubicación actual es un punto de concentración
    const [currentLocationIsCP, setCurrentLocationIsCP] = useState<any>(null);

    // datos iniciales de estimacion del viaje
    const [rideEstimation, setRideEstimation] = useState<RideEstimation>({
        distance: '0 km',
        duration: '0 min',
        price: '$0 COP',
        basePrice: 0,
        serviceFee: 0,
        totalPrice: 0,
    });

    // datos de ejemplo del conductor
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

    // funcion para mostrar errores en el modal
    const setErrorWithModal = (errorMsg: string) => {
        setError(errorMsg);
        setIsErrorModalOpen(true);
    };

    // cerrar el modal de error
    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    // Nuevo useEffect para manejar el scroll
    useEffect(() => {
        // Restaurar posición de scroll al inicio
        window.scrollTo(0, 0);
    }, []);  // Ejecutar solo una vez al montar el componente

    // obtener los puntos de concentracion de la api
    useEffect(() => {
        const fetchConcentrationPoints = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('https://drivup-backend.onrender.com/puntos-concentracion');
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                setConcentrationPoints(data);
            } catch (err) {
                setErrorWithModal('Error al cargar los puntos de concentración');
                console.error('Error fetching concentration points:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConcentrationPoints();
    }, []);

    // actualizar hora cada minuto
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // calcular hora estimada de llegada
    useEffect(() => {
        if (rideEstimation.duration) {
            const [minutes] = rideEstimation.duration.split(' ');
            const arrival = new Date();
            arrival.setMinutes(arrival.getMinutes() + parseInt(minutes));
            setEstimatedArrival(arrival.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
        }
    }, [rideEstimation.duration]);

    // calcular informacion del viaje cuando cambian origen o destino
    useEffect(() => {
        const calculateRideInfo = async () => {
            if (!originCoords || !destinationCoords) {
                return;
            }

            setCalculatingRide(true);
            
            try {
                const [originLat, originLon] = originCoords.split(',');
                const [destLat, destLon] = destinationCoords.split(',');
                
                // verifica que las coordenadas sean validas
                if (!originLat || !originLon || !destLat || !destLon) {
                    return;
                }
                
                const requestBody = {
                    origen_lat: originLat,
                    origen_lon: originLon,
                    destino_lat: destLat,
                    destino_lon: destLon,
                    es_origen_concentracion: locationType.origin === 'hcp',
                    es_destino_concentracion: locationType.destination === 'hcp'
                };
                
                // llamada a la api para calcular informacion del viaje
                const response = await fetch("https://drivup-backend.onrender.com/calcular-info-viaje", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // formatea la cadena de precio
                    const formatCurrency = (min: number, max: number) => {
                        const formatter = new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            maximumFractionDigits: 0
                        });
                        
                        return `${formatter.format(min)} - ${formatter.format(max)}`;
                    };
                    
                    // obtiene la informacion para el numero de pasajeros seleccionado
                    const selectedScenario = `pasajeros_${passengerCount}`;
                    const rideInfo = data.escenarios[selectedScenario] || data.info_viaje;
                    
                    // actualiza la estimacion del viaje
                    setRideEstimation({
                        distance: `${rideInfo.distancia.kilometros.toFixed(1)} km`,
                        duration: `${rideInfo.tiempo.tiempoTotalMinutos} min`,
                        price: formatCurrency(rideInfo.costo.costoMinimo, rideInfo.costo.costoMaximo),
                        basePrice: rideInfo.costo.desglose.costoBase,
                        serviceFee: rideInfo.costo.desglose.comisionPlataforma,
                        totalPrice: rideInfo.costo.costoMaximo,
                        detailedData: rideInfo,
                        alternativeOptions: data.escenarios
                    });
                }
            } catch (error) {
                console.error("Error calculating ride info:", error);
                setErrorWithModal("Error al calcular información del viaje");
            } finally {
                setCalculatingRide(false);
            }
        };
        
        calculateRideInfo();
    }, [originCoords, destinationCoords, locationType.origin, locationType.destination]);

    // actualizar precio cuando cambia el numero de pasajeros
    useEffect(() => {
        // si no hay opciones alternativas o datos detallados, no hacer nada
        if (!rideEstimation.alternativeOptions || !rideEstimation.detailedData) return;
        
        const selectedScenario = `pasajeros_${passengerCount}`;
        const scenarioData = rideEstimation.alternativeOptions[selectedScenario];
        
        if (scenarioData && scenarioData.costo) {
            const formatCurrency = (min: number, max: number) => {
                const formatter = new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0
                });
                
                return `${formatter.format(min)} - ${formatter.format(max)}`;
            };
            
            // actualiza solo el precio sin recalcular todo
            setRideEstimation(prev => {
                return {
                    ...prev,
                    price: formatCurrency(scenarioData.costo.costoMinimo, scenarioData.costo.costoMaximo),
                    totalPrice: scenarioData.costo.costoMaximo
                };
            });
        }
    }, [passengerCount, rideEstimation.alternativeOptions]);

    // verifica si las coordenadas pertenecen a un punto de concentracion
    const isConcentrationPoint = async (lat: string, lon: string): Promise<boolean> => {
        try {
            const response = await fetch(`https://drivup-backend.onrender.com/verificar-punto-concentracion?lat=${lat}&lon=${lon}`);
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

    // convierte direccion a coordenadas
    const convertAddressToCoordinates = async (address: string): Promise<{lat: string, lon: string} | null> => {
        try {
            const response = await fetch("https://drivup-backend.onrender.com/direccion-a-coordenadas", {
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

    // verifica si las coordenadas corresponden a un punto de concentracion y devuelve su ID
    const checkConcentrationPoint = async (lat: string, lon: string): Promise<number | null> => {
        try {
            // verifica si el punto esta cerca de un punto de concentracion
            const isNearConcentration = await isConcentrationPoint(lat, lon);
            
            if (isNearConcentration) {
                // busca el punto de concentracion mas cercano
                const response = await fetch(`https://drivup-backend.onrender.com/puntos-concentracion-cercanos?lat=${lat}&lon=${lon}&limit=1`);
                
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

    // funcion para retrasar llamadas a la api cuando se escriben direcciones
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

    // verifica si hay solicitudes de viaje activas al cargar el componente
    useEffect(() => {
        const checkActiveRequest = async () => {
            const id = getUserId();
            setUserId(id);
            
            if (!id) {
                setCheckingActiveRequest(false);
                return;
            }
            
            try {
                const response = await fetch(`https://drivup-backend.onrender.com/verificar-solicitud-activa/${id}`);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.tieneSolicitudActiva) {
                    // el usuario tiene una solicitud activa, mostrar componente de estado
                    setRequestSubmitted(true);
                    
                    // verifica si un conductor ha aceptado el viaje
                    if (data.estadoSolicitud === 'ACEPTADA') {
                        setRideAccepted(true);
                    }
                }
            } catch (error) {
                console.error('Error checking active ride requests:', error);
                setErrorWithModal('Error al verificar solicitudes de viaje activas');
            } finally {
                setCheckingActiveRequest(false);
            }
        };
        
        checkActiveRequest();
    }, []);

    // consulta periodicamente si la solicitud ha sido aceptada
    useEffect(() => {
        // solo consulta cuando hay una solicitud activa pero sin conductor asignado
        if (!requestSubmitted || rideAccepted || !userId) {
            return;
        }
        
        const checkRideStatus = async () => {
            try {
                const response = await fetch(`https://drivup-backend.onrender.com/verificar-solicitud-activa/${userId}`);
                
                if (!response.ok) {
                    return;
                }
                
                const data = await response.json();
                
                // si un conductor ha aceptado el viaje, actualiza el estado
                if (data.success && data.tieneSolicitudActiva && data.estadoSolicitud === 'ACEPTADA') {
                    setRideAccepted(true);
                }
            } catch (error) {
                console.error('Error polling ride status:', error);
            }
        };
        
        // consulta cada 5 segundos
        const intervalId = setInterval(checkRideStatus, 5000);
        
        // limpia el intervalo al desmontar o cuando cambia el estado
        return () => clearInterval(intervalId);
    }, [requestSubmitted, rideAccepted, userId]);

    // envia la solicitud de viaje al backend
    const handleSubmitRequest = async () => {
        if (!originCoords || !destinationCoords) {
            setErrorWithModal("Por favor seleccione origen y destino válidos");
            return;
        }

        const userId = getUserId();
        if (!userId) {
            setErrorWithModal("Usuario no autenticado");
            return;
        }

        setSubmittingRequest(true);
        setError(null);

        try {
            // extrae las coordenadas
            const [originLat, originLon] = originCoords.split(',');
            const [destLat, destLon] = destinationCoords.split(',');

            // determina si el origen es un punto de concentracion
            let isOriginConcentration = locationType.origin === 'hcp';
            let originPointId = originConcentrationPointId;

            // determina si el destino es un punto de concentracion
            let isDestinationConcentration = locationType.destination === 'hcp';
            let destinationPointId = destinationConcentrationPointId;

            // Debug información
            console.log('Estado inicial solicitud:', {
                locationType,
                currentLocationIsCP,
                originCoords,
                destinationCoords,
                isOriginConcentration,
                originPointId
            });

            let finalOriginLat = originLat;
            let finalOriginLon = originLon;

            // Si la ubicación actual es un punto de concentración, usamos esos datos
            if (currentLocationIsCP && locationType.origin === 'current') {
                isOriginConcentration = true;
                originPointId = currentLocationIsCP.id;
                // Usar las coordenadas del punto de concentración en lugar de la ubicación actual
                finalOriginLat = currentLocationIsCP.latitud;
                finalOriginLon = currentLocationIsCP.longitud;
                
                console.log('Origen actualizado a punto de concentración:', {
                    origin: `${finalOriginLat},${finalOriginLon}`,
                    pointId: originPointId
                });
            }
            // si el usuario no ha seleccionado explicitamente un punto de concentracion, verifica si las coordenadas coinciden
            else if (!isOriginConcentration) {
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
            
            // Realizar solicitud con los datos finales
            const response = await fetch("https://drivup-backend.onrender.com/solicitudes-viaje", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pasajero_id: parseInt(userId),
                    origen_lat: parseFloat(finalOriginLat),
                    origen_lon: parseFloat(finalOriginLon),
                    destino_lat: parseFloat(destLat),
                    destino_lon: parseFloat(destLon),
                    es_origen_concentracion: isOriginConcentration,
                    es_destino_concentracion: isDestinationConcentration,
                    origen_pmcp_id: isOriginConcentration ? originPointId : null,
                    destino_pmcp_id: isDestinationConcentration ? destinationPointId : null,
                    num_pasajeros: passengerCount
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("Ride request submitted successfully:", responseData);

            // solicitud enviada correctamente
            setRequestSubmitted(true);
        } catch (error) {
            console.error("Error al enviar solicitud de viaje:", error);
            setErrorWithModal(error instanceof Error ? error.message : "Error al enviar la solicitud de viaje");
        } finally {
            setSubmittingRequest(false);
        }
    };

    // maneja la cancelacion de una solicitud
    const handleCancelRequest = async () => {
        setRequestSubmitted(false);
        setRideAccepted(false);
    };

    // maneja los cambios en la seleccion de ubicacion
    const handleLocationChange = async (type: string, value: string, locType?: string, pointId?: number) => {
        console.log(`Location ${type} changed to:`, value, locType);
        
        // actualiza el tipo de ubicacion
        if (locType) {
            setLocationType(prev => ({ ...prev, [type]: locType }));
            
            // Si el tipo es origen y no es 'current', limpiar el estado de currentLocationIsCP
            if (type === 'origin' && locType !== 'current') {
                setCurrentLocationIsCP(null);
            }
            
            // actualiza las opciones deshabilitadas segun la seleccion de origen
            if (type === 'origin') {
                if (locType === 'hcp') {
                    // si el origen es punto de concentracion, solo se permite direccion manual para destino
                    setDisabledOptions({
                        origin: [],
                        destination: ['hcp']
                    });
                    
                    // si el destino estaba establecido como punto de concentracion, cambiarlo a manual
                    if (locationType.destination === 'hcp') {
                        setLocationType(prev => ({ ...prev, destination: 'manual' }));
                        setDestinationConcentrationPointId(null);
                        setDestinationCoords(undefined);
                    }
                } else {
                    // si el origen es ubicacion actual o manual, solo se permite punto de concentracion para destino
                    setDisabledOptions({
                        origin: [],
                        destination: ['manual', 'current']
                    });
                    
                    // si el destino estaba establecido como manual, cambiarlo a punto de concentracion
                    if (locationType.destination === 'manual') {
                        setLocationType(prev => ({ ...prev, destination: 'hcp' }));
                        setDestinationCoords(undefined);
                    }
                }
            }
        }
        
        // maneja diferentes tipos de ubicacion
        if (locType === 'current' || locType === 'hcp') {
            // para ubicacion actual o puntos de concentracion, ya tenemos las coordenadas
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

    // procesa la direccion manual despues de que el usuario deja de escribir
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
            setErrorWithModal(`Error al convertir la dirección de ${type === 'origin' ? 'origen' : 'destino'} a coordenadas`);
        }
    }, 1000); // 1 segundo de retraso

    // maneja la entrada de direccion manual
    const handleManualAddressInput = (type: string, value: string) => {
        // solo actualiza el tipo de ubicacion, pero no activa la conversion de coordenadas todavia
        if (type === 'origin' || type === 'destination') {
            // llama a la funcion retrasada para procesar la direccion
            processManualAddress(type, value);
        }
    };

    // formatea la hora en formato de 12 horas
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
    };

    // Maneja cuando la ubicación actual es un punto de concentración
    const handleCurrentLocationIsCP = (concentrationPoint: any) => {
        console.log('Ubicación actual es un punto de concentración:', concentrationPoint);
        setCurrentLocationIsCP(concentrationPoint);
        
        // Si hay un destino seleccionado y es un punto de concentración, cambiarlo a manual
        if (locationType.destination === 'hcp') {
            setDestinationConcentrationPointId(null);
        }
        
        // Forzar selección de dirección manual para el destino
        setLocationType(prev => ({ ...prev, destination: 'manual' }));
        
        // Deshabilitar "punto de concentración" para destino
        setDisabledOptions({
            origin: [],
            destination: ['hcp']
        });
        
        // Almacenar el ID del punto de concentración para usarlo en el envío
        setOriginConcentrationPointId(concentrationPoint.id);
        
        // Asegurar que la página se mantiene en la parte superior
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    };

    return (
        <HeaderFooterPasajeros>
            <div className="min-h-screen bg-[#F8F9FA]">
                {/* seccion de encabezado con degradado */}
                <div className="w-full bg-gradient-to-r from-[#2D5DA1] to-[#5AAA95] p-6 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                    <div className="max-w-7xl mx-auto relative">
                        <div className="flex justify-between items-start ml-6">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2 ">Solicitar Viaje</h1>
                                <p className="text-base text-white/80">Encuentra tu viaje de manera rápida y segura</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-white">
                                <p className="text-xs opacity-80">Hora actual</p>
                                <p className="text-xl font-medium">{formatTime(currentTime)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    {checkingActiveRequest ? (
                        // pantalla de carga mientras se verifica si hay solicitudes activas
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <div className="mb-4">
                                <div className="w-16 h-16 border-4 border-[#2D5DA1] border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                            <p className="text-[#4A4E69]">Verificando solicitudes activas...</p>
                        </div>
                    ) : requestSubmitted ? (
                        // muestra el estado de la solicitud o informacion del conductor
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {!rideAccepted ? (
                                <RequestStatus onCancel={handleCancelRequest} userId={userId} />
                            ) : (
                                <DriverInfo 
                                    driverInfo={driverInfo}
                                    estimatedArrival={estimatedArrival}
                                    onCancel={handleCancelRequest}
                                />
                            )}
                        </div>
                    ) : (
                        // formulario de solicitud de viaje
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* columna izquierda - seleccion de ubicacion */}
                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    {loading && (
                                        <div className="p-8 text-center">
                                            <p className="text-[#4A4E69]">Cargando puntos de concentración...</p>
                                        </div>
                                    )}
                                    
                                    {!loading && (
                                        <>
                                            <LocationSelector 
                                                type="origin" 
                                                onLocationChange={handleLocationChange} 
                                                onManualAddressInput={handleManualAddressInput}
                                                concentrationPoints={concentrationPoints}
                                                disabledOptions={disabledOptions.origin}
                                                selectedLocationType={locationType.origin}
                                                onCurrentLocationIsCP={handleCurrentLocationIsCP}
                                                isCPHighlighted={currentLocationIsCP !== null && locationType.origin === 'current'}
                                            />
                                            <LocationSelector 
                                                type="destination" 
                                                onLocationChange={handleLocationChange} 
                                                onManualAddressInput={handleManualAddressInput}
                                                concentrationPoints={concentrationPoints}
                                                disabledOptions={disabledOptions.destination}
                                                selectedLocationType={locationType.destination}
                                                originIsCPHighlighted={currentLocationIsCP !== null && locationType.origin === 'current'}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* columna derecha - mapa y detalles */}
                            <div className="space-y-8">
                                <MapPreview 
                                    originCoords={originCoords} 
                                    destinationCoords={destinationCoords} 
                                />
                                <RideDetails 
                                    rideEstimation={rideEstimation} 
                                    passengerCount={passengerCount}
                                    setPassengerCount={setPassengerCount}
                                    isLoading={calculatingRide}
                                />
                                <button
                                    className="w-full bg-[#F2B134] text-[#4A4E69] py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#F2B134]/90 transition-all duration-200 transform hover:scale-[1.02] mb-4 flex items-center justify-center"
                                    onClick={handleSubmitRequest}
                                    disabled={loading || !!error || !originCoords || !destinationCoords || submittingRequest || calculatingRide}
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
                            </div>
                        </div>
                    )}
                </div>
                
                {/* modal de error */}
                <ErrorModal 
                    isOpen={isErrorModalOpen} 
                    message={error || ''} 
                    onClose={handleCloseErrorModal} 
                />
            </div>
        </HeaderFooterPasajeros>
    );
};

export default SolicitarViaje;
