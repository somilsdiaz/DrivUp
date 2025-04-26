import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InfoPasajeroProfile from './infoPasajeroProfile';
import { Socket } from 'socket.io-client';
import { MessageStatus } from './message';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    status?: MessageStatus;
    _originalId?: string;
    fullDate?: Date;
}

interface ChatMessageProps {
    chatId: string;
    recipientName: string;
    recipientImage: string;
    recipientId: number;
    messages: Message[];
    currentUserId: string;
    onMessageSent: (conversationId: number, messageText: string) => void;
    socket: Socket | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    chatId,
    recipientName,
    recipientImage,
    recipientId,
    messages,
    currentUserId,
    onMessageSent,
    socket
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const firstRenderRef = useRef(true);

    // Listen for socket events
    useEffect(() => {
        if (!socket) return;

        // Confirmation that message was sent
        const handleMessageSent = (message: any) => {
            console.log('Message sent confirmation received:', message);
            
            // Instead of updating immediately, use a smoother transition
            // by preserving the message ID for animation purposes
            setLocalMessages(prev => {
                // Find the temp message matching both the text and temp ID
                const tempMessage = prev.find(msg => 
                    msg.id.startsWith('temp-') && 
                    msg.text === (message.message_text || message.text)
                );
                
                if (tempMessage) {
                    console.log('Found matching temp message to update:', tempMessage);
                    // Update the temp message content but preserve its key in _originalId field
                    // This prevents the message from "disappearing" visually
                    return prev.map(msg => 
                        (msg.id === tempMessage.id)
                            ? { 
                                ...msg, 
                                id: message.id.toString(),
                                _originalId: msg.id, // Keep original ID for stable rendering
                                status: 'delivered' as MessageStatus,
                                timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                            }
                            : msg
                    );
                } else {
                    // If no specific temp message found, look for any temp message
                    const anyTempMessage = prev.find(msg => msg.id.startsWith('temp-'));
                    
                    if (anyTempMessage) {
                        console.log('Found non-specific temp message to update:', anyTempMessage);
                        return prev.map(msg => 
                            msg.id.startsWith('temp-')
                                ? { 
                                    ...msg, 
                                    id: message.id.toString(),
                                    _originalId: msg.id, // Keep original ID for key stability
                                    status: 'delivered' as MessageStatus,
                                    timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                }
                                : msg
                        );
                    } else {
                        // If no temp message found at all, just add the new message
                        console.log('No temp message found, adding new message');
                        const newConfirmedMessage: Message = {
                            id: message.id.toString(),
                            senderId: currentUserId,
                            text: message.message_text || message.text,
                            timestamp: new Date(message.sent_at || Date.now()).toLocaleString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            status: 'delivered' as MessageStatus
                        };
                        return [...prev, newConfirmedMessage];
                    }
                }
            });
            
            setIsSending(false);
        };

        // Handle when messages are read by the recipient
        const handleMessagesRead = (data: { conversationId: number, readBy: number }) => {
            if (parseInt(chatId) === data.conversationId) {
                // Update all messages to 'read' status when recipient has read them
                setLocalMessages(prev => prev.map(msg => 
                    msg.senderId === currentUserId 
                        ? { ...msg, status: 'read' } 
                        : msg
                ));
            }
        };

        // Handle errors
        const handleMessageError = (error: any) => {
            console.error('Error sending message:', error);
            setSendError('No se pudo enviar el mensaje. Intenta de nuevo.');
            setIsSending(false);
        };

        socket.on('message_sent', handleMessageSent);
        socket.on('message_error', handleMessageError);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('message_sent', handleMessageSent);
            socket.off('message_error', handleMessageError);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, chatId, currentUserId]);

    // Mark messages as read when user views the chat
    useEffect(() => {
        if (!socket || !chatId || messages.length === 0) return;
        
        // Skip on first render to avoid unnecessary calls
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        // Check if there are messages from the recipient
        const hasRecipientMessages = messages.some(msg => msg.senderId !== currentUserId);
        
        if (hasRecipientMessages) {
            // Send event to mark messages as read
            socket.emit('mark_as_read', {
                conversationId: parseInt(chatId),
                userId: parseInt(currentUserId)
            });
        }
    }, [socket, chatId, messages, currentUserId]);

    // Add a key-based reset mechanism for localMessages when chatId changes
    useEffect(() => {
        // Reset local messages completely when switching to a different chat
        console.log('Chat ID changed, resetting local messages');
        setLocalMessages(messages);
        setSendError(null);
        setIsSending(false);
        
        // Also reset UI states
        setShowEmojis(false);
        setShowInfoModal(false);
        
        // Reset the first render flag so we mark messages as read again
        firstRenderRef.current = true;
    }, [chatId]);

    // Update local messages when prop messages change (this will run for the same chatId)
    useEffect(() => {
        // Skip if messages array is empty to avoid clearing existing messages
        if (messages.length === 0) return;
        
        console.log('Messages prop updated:', messages);
        console.log('Current local messages:', localMessages);
        
        // IMPORTANT: Instead of replacing all messages, we need to merge them
        // ensuring we keep all messages that exist either in props or local state
        
        // 1. Create maps for faster lookups
        const incomingMessagesMap = new Map();
        messages.forEach(msg => {
            incomingMessagesMap.set(msg.id, msg);
        });
        
        const localMessagesMap = new Map();
        localMessages.forEach(msg => {
            // Skip temporary messages as they will be handled separately
            if (!msg.id.startsWith('temp-')) {
                localMessagesMap.set(msg.id, msg);
            }
        });
        
        // 2. Get temporary messages that should be preserved ONLY for the current chat
        const tempMessages = localMessages.filter(msg => 
            msg.id.startsWith('temp-') && 
            msg.senderId === currentUserId // Make sure they're from the current user
        );
        
        // 3. Combine messages from both sources and remove duplicates
        const mergedMessagesMap = new Map([...localMessagesMap, ...incomingMessagesMap]);
        
        // 4. Convert the merged map back to an array
        const mergedMessages = [...mergedMessagesMap.values()];
        
        // 5. Apply status from local messages where available, or determine based on is_read property
        const finalMessages = mergedMessages.map(msg => {
            const existingMsg = localMessages.find(localMsg => localMsg.id === msg.id);
            
            // If this message is from the current user, determine its read status
            if (msg.senderId === currentUserId) {
                // If we already have a status in local messages, preserve it
                if (existingMsg?.status) {
                    return {
                        ...msg,
                        status: existingMsg.status
                    };
                }
                
                // Otherwise, determine based on the is_read property if available
                // In API responses, is_read might be available on the message object
                return {
                    ...msg,
                    // Default to 'delivered' if is_read is undefined, otherwise use 'read' if is_read is true
                    status: (msg as any).is_read === true ? 'read' as MessageStatus : 'delivered' as MessageStatus
                };
            }
            
            return {
                ...msg,
                status: existingMsg?.status
            };
        });
        
        // 6. Add temp messages to the final result
        const result = [...finalMessages, ...tempMessages];
        
        // 7. Sort messages by their ID to maintain chronological order
        result.sort((a, b) => {
            // If both are temp messages, sort by their timestamp value
            if (a.id.startsWith('temp-') && b.id.startsWith('temp-')) {
                return a.id.localeCompare(b.id);
            }
            // Temp messages always come after non-temp messages
            if (a.id.startsWith('temp-')) return 1;
            if (b.id.startsWith('temp-')) return -1;
            
            // Otherwise sort by ID (assuming they're numeric or timestamp-based)
            return parseInt(a.id) - parseInt(b.id);
        });
        
        console.log('Updated merged messages with read status:', result);
        setLocalMessages(result);
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
    }, [localMessages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || isSending) return;
        
        // Clear previous errors
        setSendError(null);
        setIsSending(true);
        
        const messageText = newMessage.trim();
        
        // Generate a unique timestamp-based ID that will be stable
        // This helps with animation transitions later
        const now = Date.now();
        const tempMessageId = `temp-${now}`;
        
        // Format time for display
        const currentTime = new Date(now);
        const formattedTime = currentTime.toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create message object
        const messageData = {
            conversationId: parseInt(chatId),
            senderId: parseInt(currentUserId),
            receiverId: recipientId,
            messageText,
            clientTempId: tempMessageId // Include temp ID for the server to reference
        };
        
        // Create optimistic message to show immediately
        const optimisticMessage: Message = {
            id: tempMessageId,
            _originalId: tempMessageId, // Store the temp ID for stable animations
            senderId: currentUserId,
            text: messageText,
            timestamp: formattedTime,
            fullDate: currentTime, // Include the full date for grouping by day
            status: 'sent'
        };
        
        // Clear input immediately to improve perceived responsiveness
        setNewMessage('');
        setShowEmojis(false);
        
        // Add message to the UI immediately
        setLocalMessages(prev => [...prev, optimisticMessage]);
        
        try {
            // Try to send via socket first if available
            if (socket && socket.connected) {
                socket.emit('send_message', messageData);
            } else {
                // Fallback to REST API if socket not available
                const response = await fetch('https://drivup-backend.onrender.com/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messageData),
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to send message: ${response.status}`);
                }
                
                setIsSending(false);
            }
            
            // Update conversation in the parent component
            onMessageSent(parseInt(chatId), messageText);
            
        } catch (error) {
            console.error('Error sending message:', error);
            setSendError('No se pudo enviar el mensaje. Intenta de nuevo.');
            
            // Remove optimistic message
            setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
            setIsSending(false);
        }
    };
    
    const toggleEmojiPicker = () => {
        setShowEmojis(!showEmojis);
    };
    
    const toggleInfoModal = () => {
        setShowInfoModal(!showInfoModal);
    };

    // Render message status indicators
    const renderMessageStatus = (message: Message) => {
        if (message.senderId !== currentUserId) return null;
        
        switch (message.status) {
            case 'read':
                return (
                    <div className="flex items-center space-x-1">
                        <div className="flex relative transform scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#5AAA95] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 -ml-1.5 text-[#5AAA95] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        </div>
                    </div>
                );
            case 'delivered':
                return (
                    <div className="flex items-center space-x-1">
                        <div className="flex relative transform scale-105">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#F2B134] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 -ml-1.5 text-[#F2B134] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        </div>
                    </div>
                );
            case 'sent':
                return (
                    <div className="flex items-center space-x-1">
                        <div className="relative transform scale-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#4A4E69]/70 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Agregar función para procesar mensajes y añadir separadores por día
    const processMessagesWithDateSeparators = (messages: Message[]) => {
        if (!messages || messages.length === 0) return [];
        
        // Función para obtener una cadena de fecha descriptiva
        const getDateLabel = (date: Date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            const messageDate = new Date(date);
            messageDate.setHours(0, 0, 0, 0);
            
            if (messageDate.getTime() === today.getTime()) {
                return "Hoy";
            } else if (messageDate.getTime() === yesterday.getTime()) {
                return "Ayer";
            } else {
                return messageDate.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        };
        
        // Convertir las cadenas de timestamp a objetos Date
        const messagesWithDates = messages.map(msg => {
            // Intentar extraer la fecha del timestamp
            // Primero intentamos con el formato completo, y si falla usamos un formato más simple
            let fullDate;
            if (msg.timestamp.includes('/')) {
                // Formato con fecha completa: "dd/mm/yyyy, hh:mm"
                const parts = msg.timestamp.split(', ');
                const dateParts = parts[0].split('/');
                if (dateParts.length === 3) {
                    fullDate = new Date(
                        parseInt(dateParts[2]), // año
                        parseInt(dateParts[1]) - 1, // mes (0-11)
                        parseInt(dateParts[0]) // día
                    );
                } else {
                    fullDate = new Date(); // En caso de error, usar fecha actual
                }
            } else {
                // Formato simple "hh:mm" - asumimos fecha actual
                fullDate = new Date();
            }
            
            return {
                ...msg,
                fullDate
            };
        });
        
        // Ordenar mensajes por fecha (más antiguos primero)
        messagesWithDates.sort((a, b) => {
            if (a.id.startsWith('temp-') && !b.id.startsWith('temp-')) return 1;
            if (!a.id.startsWith('temp-') && b.id.startsWith('temp-')) return -1;
            
            const dateA = a.fullDate || new Date();
            const dateB = b.fullDate || new Date();
            return dateA.getTime() - dateB.getTime();
        });
        
        // Agrupar mensajes por día
        const groupedByDate: { [key: string]: Message[] } = {};
        
        messagesWithDates.forEach(msg => {
            const date = msg.fullDate || new Date();
            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
            
            if (!groupedByDate[dateString]) {
                groupedByDate[dateString] = [];
            }
            
            groupedByDate[dateString].push(msg);
        });
        
        // Crear un array con separadores de fecha
        const result: (Message | { isSeparator: true, label: string, date: string })[] = [];
        
        // Ordenar las fechas (más antiguas primero)
        const sortedDates = Object.keys(groupedByDate).sort();
        
        sortedDates.forEach(dateString => {
            // Añadir el separador
            const firstMessage = groupedByDate[dateString][0];
            const date = firstMessage.fullDate || new Date();
            const label = getDateLabel(date);
            
            result.push({ 
                isSeparator: true, 
                label, 
                date: dateString 
            });
            
            // Añadir los mensajes de ese día
            result.push(...groupedByDate[dateString]);
        });
        
        return result;
    };

    // Renderizar los mensajes junto con los separadores de fecha
    const renderMessagesWithSeparators = () => {
        const processedMessages = processMessagesWithDateSeparators(localMessages);
        
        return (
            <AnimatePresence mode="sync" initial={false}>
                {processedMessages.map((item, index) => {
                    // Renderizar separador de fecha
                    if ('isSeparator' in item) {
                        return (
                            <motion.div 
                                key={`sep-${item.date}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center my-4"
                            >
                                <span className="inline-block px-3 py-1 text-xs bg-white text-[#4A4E69]/70 rounded-full shadow-sm border border-[#4A4E69]/10">
                                    {item.label}
                                </span>
                            </motion.div>
                        );
                    }
                    
                    // Renderizar mensaje normal
                    const message = item as Message;
                    return (
                        <motion.div 
                            key={message._originalId || message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0,
                                transition: { 
                                    type: "spring", 
                                    stiffness: 500, 
                                    damping: 30,
                                    mass: 1
                                }
                            }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            layoutId={message._originalId || message.id}
                            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.senderId !== currentUserId && (
                                <img 
                                    src={recipientImage} 
                                    alt={recipientName} 
                                    className="h-8 w-8 rounded-full object-cover mr-2 self-end mb-1"
                                />
                            )}
                            <motion.div 
                                layout
                                layoutId={`bubble-${message._originalId || message.id}`}
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                                    message.senderId === currentUserId 
                                        ? 'bg-gradient-to-r from-[#2D5DA1] to-[#2D5DA1]/90 text-white rounded-br-none' 
                                        : 'bg-white text-[#4A4E69] rounded-bl-none'
                                }`}
                            >
                                <p className="leading-relaxed">{message.text}</p>
                                <motion.div 
                                    layout
                                    className="flex items-center justify-end mt-1 space-x-1"
                                >
                                    <span className={`text-xs ${message.senderId === currentUserId ? 'text-white/70' : 'text-[#4A4E69]/60'}`}>
                                        {message.timestamp}
                                    </span>
                                    <motion.div layout>
                                        {renderMessageStatus(message)}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        );
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

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] bg-opacity-80 backdrop-blur-sm bg-pattern-light max-h-[calc(100vh-220px)] scrollbar-thin scrollbar-thumb-[#4A4E69]/20 scrollbar-track-transparent">
                {renderMessagesWithSeparators()}
                
                {/* Error message */}
                {sendError && (
                    <div className="bg-red-50 p-3 rounded-lg text-red-700 text-sm border border-red-200 shadow-sm flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p>{sendError}</p>
                            <button 
                                className="text-red-800 hover:text-red-900 underline text-xs mt-1"
                                onClick={() => setSendError(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
                
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
                            disabled={isSending}
                        />
                        <button 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A4E69]/50 hover:text-[#5AAA95] transition-colors"
                            onClick={toggleEmojiPicker}
                            disabled={isSending}
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
                        className={`ml-2 rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2B134] ${
                            isSending 
                                ? 'bg-[#F2B134]/70 text-[#4A4E69]/70 cursor-wait' 
                                : newMessage.trim() === '' 
                                ? 'bg-[#F2B134]/50 text-[#4A4E69]/50 cursor-not-allowed' 
                                : 'bg-[#F2B134] text-[#4A4E69] hover:bg-[#F2B134]/80 shadow-md hover:shadow-lg transform hover:scale-105'
                        }`}
                        disabled={newMessage.trim() === '' || isSending}
                    >
                        {isSending ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                        <span className="sr-only">Enviar mensaje</span>
                    </button>
                </div>
            </div>

            {/* Usar el componente InfoPasajeroProfile */}
            <InfoPasajeroProfile
                isOpen={showInfoModal}
                onClose={toggleInfoModal}
                name={recipientName}
                image={recipientImage}
                userId={recipientId}
            />
        </motion.div>
    );
};

export default ChatMessage;