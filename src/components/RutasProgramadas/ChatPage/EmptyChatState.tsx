import { FC } from 'react';
import { motion } from 'framer-motion';
import { EmptyChatStateProps } from '../../../types/chat';

const EmptyChatState: FC<EmptyChatStateProps> = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm"
        >
            <div className="text-center p-4 sm:p-6 md:p-8 max-w-md">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#2D5DA1]/20 to-[#5AAA95]/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2D5DA1]/0 to-[#5AAA95]/0 group-hover:from-[#2D5DA1]/10 group-hover:to-[#5AAA95]/10 transition-all duration-500"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 text-[#2D5DA1] transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0a0d35] mb-2 md:mb-3">Centro de Mensajes</h3>
                <p className="text-sm md:text-base text-[#4A4E69]/80 mb-3 md:mb-4 max-w-xs mx-auto">Selecciona un chat para ver la conversación completa y responder a tus mensajes.</p>
                <div className="flex flex-col space-y-2 md:space-y-3 mb-6 md:mb-8">
                    <div className="flex items-center justify-center text-[#4A4E69]/70 text-xs md:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Respuesta rápida a pasajeros
                    </div>
                    <div className="flex items-center justify-center text-[#4A4E69]/70 text-xs md:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Historial de conversaciones
                    </div>
                    <div className="flex items-center justify-center text-[#4A4E69]/70 text-xs md:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Notificaciones en tiempo real
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EmptyChatState; 