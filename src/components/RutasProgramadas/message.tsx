import React, { useState, useEffect } from 'react';

// Define message status types
export type MessageStatus = 'sent' | 'delivered' | 'read';

interface MessageProps {
    id: string;
    senderName: string;
    profileImage: string;
    lastMessage: string;
    timestamp: string;
    isRead: boolean;
    messageStatus?: MessageStatus;
    isFromCurrentUser: boolean;
    recipientRole?: string;
    onSelect: (id: string) => void;
}

const Message: React.FC<MessageProps> = ({
    id,
    senderName,
    profileImage,
    lastMessage,
    timestamp,
    isRead,
    messageStatus = 'sent',
    isFromCurrentUser,
    recipientRole,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    // Efecto de entrada para animación
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Render the appropriate message status indicator
    const renderMessageStatus = () => {
        if (!isFromCurrentUser) return null;
        
        switch (messageStatus) {
            case 'read':
                return (
                    <span className="flex items-center text-[#5AAA95] bg-[#5AAA95]/10 px-2 py-0.5 rounded-full transition-all duration-300 hover:bg-[#5AAA95]/20">
                        <div className="flex mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        Mensaje leído
                    </span>
                );
            case 'delivered':
                return (
                    <span className="flex items-center text-[#F2B134] bg-[#F2B134]/10 px-2 py-0.5 rounded-full transition-all duration-300 hover:bg-[#F2B134]/20">
                        <div className="flex mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        Entregado
                    </span>
                );
            case 'sent':
                return (
                    <span className="flex items-center text-[#4A4E69]/60 bg-[#4A4E69]/5 px-2 py-0.5 rounded-full transition-all duration-300 hover:bg-[#4A4E69]/10">
                        <div className="flex mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        Enviado
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div 
            onClick={() => onSelect(id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center p-4 cursor-pointer transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isHovered ? 'bg-[#F8F9FA] shadow-sm' : isRead ? 'bg-white' : 'bg-[#F8F9FA]/80'}`}
        >
            <div className="relative">
                <div className={`relative rounded-full overflow-hidden transition-transform duration-300 ${isHovered ? 'transform scale-105' : ''}`}>
                    <img 
                        src={profileImage} 
                        alt={`${senderName}'s profile`} 
                        className={`w-12 h-12 rounded-full object-cover border-2 ${!isRead ? 'border-[#F2B134]' : 'border-[#2D5DA1]/20'} transition-all duration-300`}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-tr from-[#0a0d35]/10 to-transparent rounded-full ${isHovered ? 'opacity-70' : 'opacity-0'} transition-opacity duration-300`}></div>
                </div>
                {!isRead && !isFromCurrentUser && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F2B134] rounded-full border-2 border-white animate-pulse"></div>
                )}
            </div>
            <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className={`font-medium text-[#4A4E69] transition-all duration-300 ${!isRead ? 'font-bold text-[#0a0d35]' : ''} ${isHovered ? 'text-[#2D5DA1]' : ''}`}>{senderName}</h3>
                    <div className="flex items-center">
                        {!isRead && !isFromCurrentUser && (
                            <span className="mr-1 text-[#F2B134] text-xs font-medium bg-[#F2B134]/10 px-2 py-0.5 rounded-full animate-pulse">
                                Nuevo
                            </span>
                        )}
                        <span className="text-xs text-[#4A4E69]/70 ml-1">{timestamp}</span>
                    </div>
                </div>
                <p className={`text-sm transition-all duration-300 ${!isRead && !isFromCurrentUser ? 'text-[#4A4E69] font-semibold' : 'text-[#4A4E69]/80'} truncate`}>
                    {isFromCurrentUser ? `Tú: ${lastMessage}` : lastMessage}
                </p>
                <div className="flex items-center mt-1 text-xs">
                    {/* Display message status for current user's messages */}
                    {isFromCurrentUser ? renderMessageStatus() : (
                        <span className="text-[#4A4E69]/60 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Responder
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;

