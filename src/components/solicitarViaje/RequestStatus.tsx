import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface RequestStatusProps {
    onCancel: () => void;
    userId: string | null;
    onRideAccepted: (conductorInfo: any) => void;
}

// Crear una sola instancia de Socket.IO
const socket = io('http://localhost:5000');

// componente que muestra el estado de la solicitud de viaje mientras se espera un conductor
const RequestStatus = ({ onCancel, userId, onRideAccepted }: RequestStatusProps) => {
    const [isCancelling, setIsCancelling] = useState(false);

    // Configurar Socket.IO al montar el componente
    useEffect(() => {
        // Si no hay userId, no podemos conectar correctamente
        if (!userId) return;
        
        // Unirse a la sala específica del usuario
        socket.emit('join_user_room', userId);
        
        // Configurar evento para escuchar cuando un conductor acepta el viaje
        const handleViajeAceptado = (data: any) => {
            console.log('Viaje aceptado:', data);
            // Notificar al componente padre que un conductor ha aceptado el viaje
            onRideAccepted(data.conductor);
        };
        
        // Registrar evento
        socket.on('viaje_aceptado', handleViajeAceptado);
        
        // Limpiar eventos al desmontar el componente
        return () => {
            socket.off('viaje_aceptado', handleViajeAceptado);
        };
    }, [userId, onRideAccepted]);

    // funcion para cancelar la solicitud de viaje en curso
    const handleCancelRide = async () => {
        if (!userId) return;
        
        try {
            setIsCancelling(true);
            
            // llamada a la api para cancelar la solicitud activa
            const response = await fetch(`http://localhost:5000/cancelar-solicitud/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cancelar la solicitud');
            }
            
            // notificar al componente padre que se cancelo la solicitud
            onCancel();
        } catch (error) {
            console.error('Error cancelling ride request:', error);
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="p-8 text-center">
            {/* animacion de carga */}
            <div className="mb-6">
                <div className="w-20 h-20 border-4 border-[#2D5DA1] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-[#4A4E69] mb-2">Tu solicitud ha sido enviada</h2>
            <p className="text-base text-[#4A4E69]/80 mb-6">Te avisaremos cuando un conductor acepte tu solicitud</p>
            <div className="flex justify-center">
                <button
                    className="w-64 mx-auto bg-[#FF6B6B] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#FF6B6B]/90 transition-all duration-200 flex justify-center items-center"
                    onClick={handleCancelRide}
                    disabled={isCancelling}
                >
                    {isCancelling ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelando...
                        </>
                    ) : 'Cancelar Solicitud'}
                </button>
            </div>
        </div>
    );
};

export default RequestStatus; 