import React from 'react';

interface MessageProps {
    id: string;
    senderName: string;
    profileImage: string;
    lastMessage: string;
    timestamp: string;
    isRead: boolean;
    onSelect: (id: string) => void;
}

const Message: React.FC<MessageProps> = ({
    id,
    senderName,
    profileImage,
    lastMessage,
    timestamp,
    isRead,
    onSelect
}) => {
    return (
        <div 
            onClick={() => onSelect(id)}
            className={`flex items-center p-4 border-b cursor-pointer transition-all hover:bg-[#F8F9FA] ${isRead ? 'bg-white' : 'bg-[#F8F9FA]'}`}
        >
            <div className="relative">
                <img 
                    src={profileImage} 
                    alt={`${senderName}'s profile`} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#2D5DA1]/20"
                />
                {!isRead && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F2B134] rounded-full border-2 border-white"></div>
                )}
            </div>
            <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className={`font-medium text-[#4A4E69] ${!isRead && 'font-bold'}`}>{senderName}</h3>
                    <div className="flex items-center">
                        {!isRead && (
                            <span className="mr-1 text-[#F2B134] text-xs font-medium">Nuevo</span>
                        )}
                        <span className="text-xs text-[#4A4E69]/70">{timestamp}</span>
                    </div>
                </div>
                <p className={`text-sm text-[#4A4E69]/80 truncate ${!isRead && 'font-semibold'}`}>
                    {lastMessage}
                </p>
                <div className="flex items-center mt-1 text-xs">
                    {isRead ? (
                        <span className="flex items-center text-[#5AAA95]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Leído
                        </span>
                    ) : (
                        <span className="flex items-center text-[#4A4E69]/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Enviado
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;

