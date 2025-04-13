import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

interface ChatMessageProps {
    chatId: string;
    recipientName: string;
    recipientImage: string;
    messages: Message[];
    currentUserId: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    chatId,
    recipientName,
    recipientImage,
    messages,
    currentUserId
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Simular indicador de escritura después de un tiempo
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTyping(messages.length > 0 && messages[messages.length - 1].senderId !== currentUserId);
            setTimeout(() => setIsTyping(false), 3000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [messages, currentUserId]);

    // Desplazarse al último mensaje cuando cambian los mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        // Aquí iría la lógica para enviar el mensaje
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            {/* Header del chat */}
            <div className="flex items-center justify-between p-4 border-b bg-[#0a0d35] text-white">
                <div className="flex items-center">
                    <img 
                        src={recipientImage} 
                        alt={`${recipientName}'s profile`} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                    />
                    <div className="ml-3">
                        <h3 className="font-medium text-white">{recipientName}</h3>
                        <span className="text-xs text-white/70">Conductor</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA]">
                <div className="text-center my-4">
                    <span className="inline-block px-3 py-1 text-xs bg-white text-[#4A4E69]/70 rounded-full shadow-sm">
                        Hoy
                    </span>
                </div>
                
                {messages.map((message) => (
                    <div 
                        key={message.id}
                        className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.senderId !== currentUserId && (
                            <img 
                                src={recipientImage} 
                                alt={recipientName} 
                                className="h-8 w-8 rounded-full object-cover mr-2 self-end mb-1"
                            />
                        )}
                        <div 
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${message.senderId === currentUserId 
                                ? 'bg-[#2D5DA1] text-white rounded-br-none' 
                                : 'bg-white text-[#4A4E69] rounded-bl-none'}`}
                        >
                            <p className="leading-relaxed">{message.text}</p>
                            <div className="flex items-center justify-end mt-1 space-x-1">
                                <span className={`text-xs ${message.senderId === currentUserId ? 'text-white/70' : 'text-[#4A4E69]/60'}`}>
                                    {message.timestamp}
                                </span>
                                {message.senderId === currentUserId && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <img 
                            src={recipientImage} 
                            alt={recipientName} 
                            className="h-8 w-8 rounded-full object-cover mr-2 self-end mb-1"
                        />
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 rounded-full bg-[#4A4E69]/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-[#4A4E69]/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-[#4A4E69]/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Área de entrada de mensaje */}
            <div className="border-t p-4 bg-white">
                <div className="flex items-center">
                    <button className="p-2 text-[#4A4E69]/70 hover:text-[#2D5DA1] rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <div className="relative flex-1 mx-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="w-full border border-[#4A4E69]/20 rounded-full py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#2D5DA1] focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A4E69]/50 hover:text-[#5AAA95] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="ml-2 bg-[#F2B134] text-[#4A4E69] rounded-full p-3 hover:bg-[#F2B134]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
                        disabled={newMessage.trim() === ''}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span className="sr-only">Enviar mensaje</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;