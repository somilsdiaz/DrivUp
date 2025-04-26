import React from 'react';

interface ChatHeaderProps {
    recipientName: string;
    recipientImage: string;
    toggleInfoModal: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
    recipientName, 
    recipientImage, 
    toggleInfoModal 
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] text-white sticky top-0 z-10">
            <div className="flex items-center">
                <div className="relative">
                    <img 
                        src={recipientImage} 
                        alt={`${recipientName}'s profile`} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30 transition-transform hover:scale-105"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium text-white">{recipientName}</h3>
                </div>
            </div>
            <div className="flex space-x-2">
                <button 
                    className="p-2 rounded-full hover:bg-white/10 transition-colors" 
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