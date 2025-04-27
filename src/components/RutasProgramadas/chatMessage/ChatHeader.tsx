import React from 'react';

interface ChatHeaderProps {
    recipientName: string;
    recipientImage: string;
    toggleInfoModal: () => void;
    onBackToList?: () => void;
    showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
    recipientName, 
    recipientImage, 
    toggleInfoModal,
    onBackToList,
    showBackButton
}) => {
    return (
        <div className="flex items-center justify-between p-3 md:p-4 border-b bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] text-white sticky top-0 z-10">
            <div className="flex items-center flex-grow">
                {/* Back button - only shown on mobile when requested */}
                {showBackButton && onBackToList && (
                    <button 
                        onClick={onBackToList}
                        className="md:hidden flex items-center text-white hover:text-white/80 transition-colors mr-2 bg-white/10 px-2 py-1 rounded-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-medium">Volver</span>
                    </button>
                )}
                
                <div className="relative">
                    <img 
                        src={recipientImage} 
                        alt={`${recipientName}'s profile`} 
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-white/30 transition-transform hover:scale-105"
                    />
                </div>
                <div className="ml-2 md:ml-3 truncate">
                    <h3 className="font-medium text-sm md:text-base text-white truncate max-w-[180px] md:max-w-none">{recipientName}</h3>
                </div>
            </div>
            <div className="flex space-x-1 md:space-x-2">
                <button 
                    className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors" 
                    title="Información del contacto"
                    onClick={toggleInfoModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader; 