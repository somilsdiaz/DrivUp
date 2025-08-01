import { useEffect, useState } from 'react';
import { socket } from '../../utils/socket';
import VisualizacionRuta from '../../components/visualizacionRuta';
import { getUserId } from '../../utils/auth';

interface DriverInfoProps {
    driverInfo: {
        id?: number;
        nombre?: string;
        name?: string;
        rating?: number;
        vehiculo?: string;
        vehicle?: string;
        placa?: string;
        plate?: string;
        eta?: string;
        arrivalTime?: string;
        foto?: string;
        photo?: string;
        completedRides?: number;
        languages?: string[];
        vehicleFeatures?: string[];
        conductorId?: number;
    };
    estimatedArrival: string;
    onCancel: () => void;
    onComplete?: () => void;
    userId?: string | null;
    onRideCanceled?: (conductorInfo: any) => void;
    viajeId?: number;
}

// componente que muestra la informacion del conductor asignado al pasajero
const DriverInfo = ({ driverInfo, estimatedArrival, onCancel, onComplete, userId, onRideCanceled, viajeId: propViajeId }: DriverInfoProps) => {
    const [currentViajeId, setCurrentViajeId] = useState<number | undefined>(propViajeId);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [conductorId, setConductorId] = useState<number | undefined>(driverInfo.id || driverInfo.conductorId);
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    // Si el conductorId cambia en driverInfo, actualizamos el estado
    useEffect(() => {
        if (driverInfo.id || driverInfo.conductorId) {
            setConductorId(driverInfo.id || driverInfo.conductorId);
        }
    }, [driverInfo.id, driverInfo.conductorId]);
    
    // Obtener el ID del viaje actual del usuario
    useEffect(() => {
        // Si ya tenemos un ID de viaje por props, no necesitamos buscarlo
        if (propViajeId) return;
        
        const fetchViajeId = async () => {
            const currentUserId = userId || getUserId();
            
            if (!currentUserId) return;
            
            try {
                const response = await fetch(`https://drivup-backend.onrender.com/viaje-actual/${currentUserId}`);
                
                if (!response.ok) {
                    console.error('No se pudo obtener el viaje actual');
                    return;
                }
                
                const data = await response.json();
                
                if (data.success && data.viajeId) {
                    setCurrentViajeId(data.viajeId);
                    console.log('ID de viaje obtenido:', data.viajeId);
                }
            } catch (error) {
                console.error('Error al obtener el viaje actual:', error);
            }
        };
        
        fetchViajeId();
    }, [userId, propViajeId]);

    // Escuchar eventos del servidor de cancelación de viaje
    useEffect(() => {
        // Solo si el componente puede manejar las cancelaciones
        if (!userId || !onRideCanceled) return;
        
        console.log(`DriverInfo: Configurando listener para viaje_cancelado para usuario ${userId}`);
        
        // Manejar cancelación de viaje
        const handleViajeCancelado = (data: any) => {
            console.log('DriverInfo: Viaje cancelado por conductor:', data);
            if (onRideCanceled) {
                onRideCanceled(data.conductor);
            }
        };
        
        // Registrar eventos
        socket.on('viaje_cancelado', handleViajeCancelado);
        
        // Limpiar eventos al desmontar
        return () => {
            socket.off('viaje_cancelado', handleViajeCancelado);
        };
    }, [userId, onRideCanceled]);

    // Escuchar eventos de socket para obtener o actualizar el ID del conductor
    useEffect(() => {
        // Solo configurar si tenemos userId pero no tenemos conductorId
        if (!userId || conductorId) return;
        
        const handleAsignacionConductor = (data: any) => {
            console.log('DriverInfo: Conductor asignado:', data);
            if (data.conductor && data.conductor.id) {
                setConductorId(data.conductor.id);
            }
        };
        
        socket.on('conductor_asignado', handleAsignacionConductor);
        
        return () => {
            socket.off('conductor_asignado', handleAsignacionConductor);
        };
    }, [userId, conductorId]);
    
    // Normalizar los campos para que funcionen con ambos formatos de datos
    const normalizedDriverInfo = {
        id: driverInfo.id || driverInfo.conductorId,
        name: driverInfo.nombre || driverInfo.name || 'Conductor',
        rating: driverInfo.rating || 4.5,
        vehicle: driverInfo.vehiculo || driverInfo.vehicle || 'Vehículo no especificado',
        plate: driverInfo.placa || driverInfo.plate || 'Sin placa',
        eta: driverInfo.eta || '5 min',
        photo: driverInfo.foto 
            ? (driverInfo.foto.startsWith('http') ? driverInfo.foto : `https://drivup-backend.onrender.com/uploads/${driverInfo.foto}`) 
            : (driverInfo.photo || 'https://randomuser.me/api/portraits/men/32.jpg'),
        completedRides: driverInfo.completedRides || 0,
        languages: driverInfo.languages || ['Español'],
        vehicleFeatures: driverInfo.vehicleFeatures || ['A/C']
    };

    // funcion para cancelar el viaje en curso
    const handleCancelRide = async () => {
        if (!userId) return;
        
        try {
            setIsCancelling(true);
            
            // llamada a la api para cancelar el viaje activo
            const response = await fetch(`https://drivup-backend.onrender.com/cancelar-solicitud/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cancelar el viaje');
            }
            
            // notificar al componente padre que se cancelo el viaje
            onCancel();
        } catch (error) {
            console.error('Error cancelling ride:', error);
        } finally {
            setIsCancelling(false);
        }
    };

    // función para marcar el viaje como completado
    const handleCompleteRide = async () => {
        const currentUserId = userId || getUserId();
        
        if (!currentUserId) return;
        
        try {
            setIsCompleting(true);
            
            // llamada a la api para marcar el viaje como completado
            const response = await fetch(`https://drivup-backend.onrender.com/completar-solicitud/${currentUserId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al marcar el viaje como completado');
            }
            
            // notificar al componente padre que se completó el viaje
            if (onComplete) {
                onComplete();
            }
        } catch (error) {
            console.error('Error completing ride:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <div className="p-8">
            {/* seccion de mensaje de confirmacion */}
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#5AAA95] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#4A4E69] mb-3">¡Pronto te recogerán!</h2>
                <p className="text-xl text-[#4A4E69]/80">Tu conductor está en camino</p>
            </div>

            {/* tarjeta con los datos del conductor y vehiculo */}
            <div className="bg-[#F8F9FA] p-8 rounded-xl mb-8">
                <div className="flex items-center mb-8">
                    <img 
                        src={normalizedDriverInfo.photo}
                        alt={normalizedDriverInfo.name}
                        className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white shadow-lg"
                    />
                    <div>
                        <p className="text-2xl font-bold text-[#4A4E69]">{normalizedDriverInfo.name}</p>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F2B134]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="ml-2 text-[#4A4E69] text-lg">{normalizedDriverInfo.rating}</span>
                            <span className="ml-4 text-[#4A4E69]/60">• {normalizedDriverInfo.completedRides} viajes</span>
                        </div>
                        <div className="mt-2 flex items-center">
                            {normalizedDriverInfo.languages.map((lang, index) => (
                                <span key={index} className="text-xs bg-[#2D5DA1]/10 text-[#2D5DA1] px-2 py-1 rounded-full mr-2">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* informacion del vehiculo y tiempos estimados */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Vehículo</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{normalizedDriverInfo.vehicle}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {normalizedDriverInfo.vehicleFeatures.map((feature, index) => (
                                <span key={index} className="text-xs bg-[#5AAA95]/10 text-[#5AAA95] px-2 py-1 rounded-full">
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Placa</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{normalizedDriverInfo.plate}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Tiempo de llegada</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{normalizedDriverInfo.eta}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-sm text-[#4A4E69]/60 mb-2">Llegada a destino</p>
                        <p className="text-xl font-semibold text-[#4A4E69]">{estimatedArrival}</p>
                    </div>
                </div>
            </div>

            {/* Visualización de la ruta */}
            <div className="h-[400px] rounded-xl mb-12 relative overflow-hidden ">
                {currentViajeId && normalizedDriverInfo.id ? (
                    <div className="absolute inset-0 z-0 flex items-center justify-center">
                        <VisualizacionRuta 
                            viajeId={currentViajeId} 
                            conductorId={normalizedDriverInfo.id} 
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F8F9FA]">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4A4E69]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="text-[#4A4E69]/60 text-lg">Mapa con ruta final</span>
                        </div>
                    </div>
                )}
            </div>

            {/* boton para cancelar viaje */}
            <button
                className="w-full bg-[#FF6B6B] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#FF6B6B]/90 transition-all duration-200 mb-4"
                onClick={handleCancelRide}
                disabled={isCancelling}
            >
                {isCancelling ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cancelando...
                    </>
                ) : 'Cancelar Viaje'}
            </button>
            
            {/* boton para marcar viaje como completado */}
            <button
                className="w-full bg-[#5AAA95] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#5AAA95]/90 transition-all duration-200"
                onClick={handleCompleteRide}
                disabled={isCompleting}
            >
                {isCompleting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Completando...
                    </>
                ) : 'Marcar Viaje como Completado'}
            </button>
        </div>
    );
};

export default DriverInfo; 