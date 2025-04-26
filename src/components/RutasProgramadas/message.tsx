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
    onSelect: (id: string) => void;
    recipientRole?: string;
    isHighlighted?: boolean;
    highlightedMessageId?: string;
    totalMatches?: number;
    matchedMessageIds?: string[];
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
    onSelect,
    recipientRole = 'pasajero',
    isHighlighted = false,
    highlightedMessageId,
    totalMatches = 0,
    matchedMessageIds = []
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
                        <div className="flex relative transform scale-110 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 -ml-1.5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        Mensaje leído
                    </span>
                );
            case 'delivered':
                return (
                    <span className="flex items-center text-[#F2B134] bg-[#F2B134]/10 px-2 py-0.5 rounded-full transition-all duration-300 hover:bg-[#F2B134]/20">
                        <div className="flex relative transform scale-105 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 -ml-1.5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        Entregado
                    </span>
                );
            case 'sent':
                return (
                    <span className="flex items-center text-[#4A4E69]/70 bg-[#4A4E69]/5 px-2 py-0.5 rounded-full transition-all duration-300 hover:bg-[#4A4E69]/10">
                        <div className="relative transform scale-100 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        Enviado
                    </span>
                );
            default:
                return null;
        }
    };

    // Indicador de rol para el usuario
    const renderRoleIndicator = () => {
        if (recipientRole === 'conductor y pasajero') {
            return (
                <span className="text-xs ml-1 font-medium px-1 py-0.5 bg-gradient-to-r from-[#2D5DA1]/20 to-[#5AAA95]/20 text-[#2D5DA1] rounded-full mr-1.5 flex  items-center shadow-sm border border-[#2D5DA1]/20 transition-all duration-300 hover:from-[#2D5DA1]/30 hover:to-[#5AAA95]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#2D5DA1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Conductor
                </span>
            );
        }
        return null;
    };

    // funcion para manejar clic en el mensaje
    const handleClick = () => {
        // pasamos el id del mensaje destacado si existe, para hacer scroll
        onSelect(id);
        
        // guardamos los ids de los mensajes destacados para recuperarlos después
        if (isHighlighted) {
            // Clear any existing localStorage data first
            localStorage.removeItem('scrollToMessageId');
            localStorage.removeItem('highlightedMessageIds');
            localStorage.removeItem('totalMatches');
            
            if (matchedMessageIds && matchedMessageIds.length > 0) {
                localStorage.setItem('scrollToMessageId', highlightedMessageId || '');
                localStorage.setItem('highlightedMessageIds', JSON.stringify(matchedMessageIds));
                localStorage.setItem('totalMatches', totalMatches.toString());
                
                // Dispatch a custom event to notify that highlights have changed
                window.dispatchEvent(new CustomEvent('highlightUpdated', {
                    detail: {
                        highlightedMessageId,
                        matchedMessageIds,
                        totalMatches
                    }
                }));
            } else if (highlightedMessageId) {
                localStorage.setItem('scrollToMessageId', highlightedMessageId);
                localStorage.setItem('totalMatches', '1');
                
                // Dispatch a custom event to notify that highlights have changed
                window.dispatchEvent(new CustomEvent('highlightUpdated', {
                    detail: {
                        highlightedMessageId,
                        totalMatches: 1
                    }
                }));
            }
        }
    };

    return (
        <div 
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center p-4 cursor-pointer transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${
                isHighlighted ? 'bg-[#F2B134]/10 hover:bg-[#F2B134]/20' : 
                isHovered ? 'bg-[#F8F9FA] shadow-sm' : 
                isRead ? 'bg-white' : 'bg-[#F8F9FA]/80'
            }`}
        >
            <div className="relative">
                <div className={`relative rounded-full overflow-hidden transition-transform duration-300 ${isHovered ? 'transform scale-105' : ''}`}>
                    <img 
                        src={profileImage} 
                        alt={`${senderName}'s profile`} 
                        className={`w-12 h-12 rounded-full object-cover border-2 ${!isRead ? 'border-[#F2B134]' : 'border-[#2D5DA1]/20'} transition-all duration-300`}
                    />
                    {recipientRole === 'conductor y pasajero' && (
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#2D5DA1] to-[#5AAA95] rounded-full w-5 h-5 border-2 border-white flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-110 group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <div className="absolute opacity-0 group-hover:opacity-100 -top-6 right-0 bg-white px-2 py-1 rounded-lg shadow-md text-xs whitespace-nowrap text-[#2D5DA1] pointer-events-none transition-opacity duration-300">
                                Conductor y pasajero
                            </div>
                        </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-tr from-[#0a0d35]/10 to-transparent rounded-full ${isHovered ? 'opacity-70' : 'opacity-0'} transition-opacity duration-300`}></div>
                </div>
                {!isRead && !isFromCurrentUser && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F2B134] rounded-full border-2 border-white animate-pulse"></div>
                )}
            </div>
            <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <h3 className={`font-medium text-[#4A4E69] transition-all duration-300 ${!isRead ? 'font-bold text-[#0a0d35]' : ''} ${isHovered ? 'text-[#2D5DA1]' : ''}`}>{senderName}</h3>
                        {renderRoleIndicator()}
                    </div>
                    <div className="flex items-center">
                        {!isRead && !isFromCurrentUser && (
                            <span className="mr-1 text-[#F2B134] text-xs font-medium bg-[#F2B134]/10 px-2 py-0.5 rounded-full animate-pulse">
                                Nuevo
                            </span>
                        )}
                        {isHighlighted && (
                            <span className="mr-1 text-[#5AAA95] text-xs font-medium bg-[#5AAA95]/10 px-2 py-0.5 rounded-full flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {totalMatches > 1 ? `${totalMatches} coincidencias` : 'Coincidencia'}
                            </span>
                        )}
                        <span className="text-xs text-[#4A4E69]/70 ml-1">{timestamp}</span>
                    </div>
                </div>
                <p className={`text-sm transition-all duration-300 ${
                    isHighlighted ? 'text-[#2D5DA1] font-semibold' :
                    !isRead && !isFromCurrentUser ? 'text-[#4A4E69] font-semibold' : 
                    'text-[#4A4E69]/80'
                } truncate`}>
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

