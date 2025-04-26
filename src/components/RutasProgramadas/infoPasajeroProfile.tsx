import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
    id: number;
    name: string;
    second_name: string | null;
    last_name: string;
    second_last_name: string | null;
    document_type: string;
    document_number: string;
    email: string;
    phone_number: string;
    created_at: string;
}

interface InfoPasajeroProfileProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    image: string;
    userId?: number; // ID del usuario para obtener datos de la API
    rating?: number;
}

const InfoPasajeroProfile: React.FC<InfoPasajeroProfileProps> = ({
    isOpen,
    onClose,
    name,
    image,
    userId,
    rating = 4.8
}) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userRole, setUserRole] = useState<string>('pasajero');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId || !isOpen) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                // Obtener los datos del usuario
                const userResponse = await fetch(`https://drivup-backend.onrender.com/usuario/${userId}`);
                if (!userResponse.ok) {
                    throw new Error(`Error al obtener datos del usuario: ${userResponse.status}`);
                }
                const userData = await userResponse.json();
                
                // Obtener el rol del usuario
                const roleResponse = await fetch(`https://drivup-backend.onrender.com/usuarios/${userId}/role`);
                if (!roleResponse.ok) {
                    throw new Error(`Error al obtener el rol: ${roleResponse.status}`);
                }
                const roleData = await roleResponse.json();
                
                setUserData(userData);
                setUserRole(roleData.role);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("No se pudo cargar la información del usuario");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [userId, isOpen]);

    // Formatear la fecha de registro
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Obtener el nombre completo
    const getFullName = () => {
        if (!userData) return name;
        
        const parts = [
            userData.name,
            userData.second_name,
            userData.last_name,
            userData.second_last_name
        ].filter(Boolean);
        
        return parts.join(' ');
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ 
                            type: "spring", 
                            damping: 25, 
                            stiffness: 300 
                        }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-lg w-[95%] sm:w-[500px] h-auto max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#4A4E69]/10 flex flex-col h-full">
                            {/* Header con gradiente */}
                            <div className="bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] text-white p-4 sticky top-0 z-10 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold">Perfil de Usuario</h2>
                                    <button 
                                        onClick={onClose}
                                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-sm text-white/70 mt-0.5">Información detallada del usuario</p>
                            </div>
                            
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 px-6 flex-grow">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </motion.div>
                                    <p className="mt-4 text-[#4A4E69] font-medium">Cargando información...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-10 px-6 bg-red-50 flex-grow">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-3 text-red-800 font-semibold text-lg">Error</h3>
                                    <p className="mt-1 text-red-600 text-center">{error}</p>
                                    <button 
                                        className="mt-4 px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
                                        onClick={onClose}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            ) : (
                                <div className="p-5 flex-grow flex flex-col h-full overflow-hidden">
                                    {/* Contenedor principal con altura fija y contenido ajustado */}
                                    <div className="flex flex-col h-full">
                                        {/* Cabecera con imagen y datos básicos */}
                                        <div className="flex items-center space-x-5 mb-5">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#2D5DA1]/20 shadow-md">
                                                    <img 
                                                        src={image} 
                                                        alt={getFullName()} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {userRole === 'conductor y pasajero' && (
                                                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#2D5DA1] to-[#5AAA95] rounded-full p-[3px] shadow-lg border-2 border-white">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-xl font-bold text-[#0a0d35] leading-tight">{getFullName()}</h3>
                                                
                                                {/* Distintivo de Rol */}
                                                <div className={`inline-flex mt-1 px-3 py-0.5 rounded-full text-sm font-medium 
                                                    ${userRole === 'conductor y pasajero' 
                                                        ? 'bg-gradient-to-r from-[#2D5DA1]/20 to-[#5AAA95]/20 text-[#2D5DA1]' 
                                                        : 'bg-[#F2B134]/10 text-[#F2B134]'}`}>
                                                    {userRole === 'conductor y pasajero' ? (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                            </svg>
                                                            Conductor y Pasajero
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            Pasajero
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Calificación */}
                                                <div className="flex items-center mt-2">
                                                    <span className="text-[#0a0d35] font-bold text-base mr-2">{rating.toFixed(1)}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star <= Math.floor(rating) ? 'text-[#F2B134]' : 'text-[#F2B134]/30'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Información de contacto y datos personales */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1 flex-grow">
                                            {/* Columna 1: Información de contacto */}
                                            <div className="space-y-3">
                                                <h4 className="text-[#0a0d35] font-semibold text-sm border-l-2 border-[#2D5DA1] pl-2 mb-3">Contacto</h4>
                                                
                                                {userData?.phone_number && (
                                                    <div className="flex items-center p-2.5 bg-[#F8F9FA] rounded-lg">
                                                        <div className="bg-[#2D5DA1]/10 p-1.5 rounded-lg flex-shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-2 overflow-hidden">
                                                            <p className="text-xs text-[#4A4E69]/60 leading-tight">Teléfono</p>
                                                            <p className="text-[#4A4E69] font-medium text-sm truncate leading-tight">{userData?.phone_number}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {userData?.email && (
                                                    <div className="flex items-center p-2.5 bg-[#F8F9FA] rounded-lg">
                                                        <div className="bg-[#2D5DA1]/10 p-1.5 rounded-lg flex-shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-2 overflow-hidden">
                                                            <p className="text-xs text-[#4A4E69]/60 leading-tight">Email</p>
                                                            <p className="text-[#4A4E69] font-medium text-sm truncate leading-tight">{userData?.email}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Columna 2: Datos personales */}
                                            <div className="space-y-3">
                                                <h4 className="text-[#0a0d35] font-semibold text-sm border-l-2 border-[#2D5DA1] pl-2 mb-3">Datos personales</h4>
                                                
                                                {userData?.document_type && userData?.document_number && (
                                                    <div className="flex items-center p-2.5 bg-[#F8F9FA] rounded-lg">
                                                        <div className="bg-[#2D5DA1]/10 p-1.5 rounded-lg flex-shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-2 overflow-hidden">
                                                            <p className="text-xs text-[#4A4E69]/60 leading-tight">Documento</p>
                                                            <p className="text-[#4A4E69] font-medium text-sm truncate leading-tight">{userData?.document_type}: {userData?.document_number}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {userData?.created_at && (
                                                    <div className="flex items-center p-2.5 bg-[#F8F9FA] rounded-lg">
                                                        <div className="bg-[#2D5DA1]/10 p-1.5 rounded-lg flex-shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-2 overflow-hidden">
                                                            <p className="text-xs text-[#4A4E69]/60 leading-tight">Registro</p>
                                                            <p className="text-[#4A4E69] font-medium text-sm truncate leading-tight">{formatDate(userData?.created_at)}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Botón de cerrar */}
                                    <div className="mt-4 pt-3 border-t border-[#4A4E69]/10 flex justify-center flex-shrink-0">
                                        <button 
                                            className="px-6 py-2 bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2D5DA1]/50 font-medium text-sm"
                                            onClick={onClose}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default InfoPasajeroProfile;
