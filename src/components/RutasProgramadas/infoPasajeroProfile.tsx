import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoPasajeroProfileProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    image: string;
    phone?: string;
    email?: string;
    address?: string;
    rating?: number;
}

const InfoPasajeroProfile: React.FC<InfoPasajeroProfileProps> = ({
    isOpen,
    onClose,
    name,
    image,
    phone = '+52 55 1234 5678',
    email,
    address = 'Av. Universidad 3000, CDMX',
    rating = 4.8
}) => {
    // Generate email from name if not provided
    const generatedEmail = email || `${name.toLowerCase().replace(' ', '.')}@email.com`;
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 max-w-md w-full"
                    >
                        <div className="flex flex-col items-center">
                            <img 
                                src={image} 
                                alt={name} 
                                className="w-24 h-24 rounded-full object-cover border-4 border-[#2D5DA1]/20 mb-4"
                            />
                            <h3 className="text-2xl font-bold text-[#0a0d35] mb-1">{name}</h3>
                            <p className="text-[#4A4E69]/70 mb-4">Pasajero</p>
                            
                            <div className="w-full space-y-4 mt-2">
                                <div className="flex items-center p-3 bg-[#F8F9FA] rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2D5DA1] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-[#4A4E69]/60">Teléfono</p>
                                        <p className="text-[#4A4E69]">{phone}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-[#F8F9FA] rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2D5DA1] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-[#4A4E69]/60">Correo electrónico</p>
                                        <p className="text-[#4A4E69]">{generatedEmail}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-[#F8F9FA] rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2D5DA1] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-[#4A4E69]/60">Dirección</p>
                                        <p className="text-[#4A4E69]">{address}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-[#F8F9FA] rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2D5DA1] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-[#4A4E69]/60">Calificación</p>
                                        <div className="flex items-center">
                                            <p className="text-[#4A4E69] mr-2">{rating}/5</p>
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
                            </div>
                            
                            <div className="flex space-x-3 mt-6">
                                <button 
                                    className="px-4 py-2 bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                    onClick={onClose}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default InfoPasajeroProfile;
