import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isRead?: boolean;
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
    const [showEmojis, setShowEmojis] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Efecto para enfocar el input cuando se abre el chat
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [chatId]);

    // Desplazarse al último mensaje cuando cambian los mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        // Aquí iría la lógica para enviar el mensaje
        setNewMessage('');
        setShowEmojis(false);
    };
    
    const toggleEmojiPicker = () => {
        setShowEmojis(!showEmojis);
    };
    

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
            {/* Header del chat */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#0a0d35] to-[#2D5DA1] text-white sticky top-0 z-10">
                <div className="flex items-center">
                    <div className="relative">
                        <img 
                            src={recipientImage} 
                            alt={`${recipientName}'s profile`} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/30 transition-transform hover:scale-105"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium text-white">{recipientName}</h3>
                    </div>
                </div>
                <div className="flex space-x-2">

                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Más opciones">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm bg-pattern-light max-h-[calc(100vh-220px)] scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
                <div className="text-center my-4">
                    <span className="inline-block px-3 py-1 text-xs bg-white text-[#4A4E69]/70 rounded-full shadow-sm border border-[#4A4E69]/10">
                        Hoy
                    </span>
                </div>
                
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div 
                            key={message.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
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
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${message.senderId === currentUserId 
                                ? 'bg-gradient-to-r from-[#2D5DA1] to-[#2D5DA1]/90 text-white rounded-br-none' 
                                : 'bg-white text-[#4A4E69] rounded-bl-none'}`}
                        >
                            <p className="leading-relaxed">{message.text}</p>
                            <div className="flex items-center justify-end mt-1 space-x-1">
                                <span className={`text-xs ${message.senderId === currentUserId ? 'text-white/70' : 'text-[#4A4E69]/60'}`}>
                                    {message.timestamp}
                                </span>
                                {message.senderId === currentUserId && (
                                    <div className="flex">
                                        {message.isRead ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#F2B134]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {message.isRead ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 -ml-1 text-[#5AAA95]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 -ml-1 text-[#F2B134]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
            </div>

            {/* Área de entrada de mensaje */}
            <div className="border-t p-4 bg-white sticky bottom-0 z-10 shadow-md">
                <div className="flex items-center">    
                    <div className="relative flex-1 mx-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="w-full border border-[#4A4E69]/20 rounded-full py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#2D5DA1] focus:border-transparent shadow-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A4E69]/50 hover:text-[#5AAA95] transition-colors"
                            onClick={toggleEmojiPicker}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        
                        {showEmojis && (
                            <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl p-2 border border-gray-200 grid grid-cols-6 gap-1 w-64">
                                {['😊', '😂', '❤️', '👍', '🙏', '😍', '😎', '🔥', '🎉', '👋', '😢', '🤔'].map(emoji => (
                                    <button 
                                        key={emoji} 
                                        className="text-xl p-1 hover:bg-gray-100 rounded transition-colors"
                                        onClick={() => setNewMessage(prev => prev + emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={handleSendMessage}
                        className={`ml-2 rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2B134] ${newMessage.trim() === '' 
                            ? 'bg-[#F2B134]/50 text-[#4A4E69]/50 cursor-not-allowed' 
                            : 'bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/80 shadow-md hover:shadow-lg transform hover:scale-105'}`}
                        disabled={newMessage.trim() === ''}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span className="sr-only">Enviar mensaje</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;