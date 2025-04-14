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
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Simular indicador de escritura después de un tiempo
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTyping(messages.length > 0 && messages[messages.length - 1].senderId !== currentUserId);
            setTimeout(() => setIsTyping(false), 3000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [messages, currentUserId]);
    
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
    
    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // Aquí iría la lógica para grabar audio
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
                        <span className="text-xs text-white/70 flex items-center">
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            En línea ahora
                        </span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Llamada de voz">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Videollamada">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Más opciones">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm bg-pattern-light">
                <div className="text-center my-4">
                    <span className="inline-block px-3 py-1 text-xs bg-white text-[#4A4E69]/70 rounded-full shadow-sm border border-[#4A4E69]/10">
                        Hoy
                    </span>
                </div>
                
                {isTyping && (
                    <div className="flex justify-start">
                        <img 
                            src={recipientImage} 
                            alt={recipientName} 
                            className="h-8 w-8 rounded-full object-cover mr-2 self-end mb-1"
                        />
                        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm rounded-bl-none max-w-xs">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 rounded-full bg-[#4A4E69]/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-[#4A4E69]/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-[#4A4E69]/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                
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
                    <div className="flex space-x-1">
                        <button className="p-2 text-[#4A4E69]/70 hover:text-[#2D5DA1] rounded-full transition-colors hover:bg-[#2D5DA1]/10" title="Adjuntar archivo">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                        <button 
                            className={`p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 bg-red-100' : 'text-[#4A4E69]/70 hover:text-[#2D5DA1] hover:bg-[#2D5DA1]/10'}`} 
                            onClick={toggleRecording}
                            title="Grabar audio"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="relative flex-1 mx-2">
                        {isRecording && (
                            <div className="absolute -top-10 left-0 right-0 bg-white p-2 rounded-lg shadow-lg text-center text-sm text-red-500 font-medium flex items-center justify-center">
                                <span className="animate-pulse mr-2">●</span> Grabando audio...
                            </div>
                        )}
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